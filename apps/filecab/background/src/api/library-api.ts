import { Observable, of } from 'rxjs';
import { Library } from '@shared/models/library';
import { catchError, map, pluck } from 'rxjs/operators';
import { chromeStoreApi } from './chrome-store.api';
import { isArray } from "lodash-es";
import { LibraryItemV2 } from "@filecab/models/library";

const KEY_OLD_DATA = 'filecabOldData';

class LibraryApi {
  load(): Observable<Library> {
    return chromeStoreApi.getStore<Library>().pipe(
      map(store => {

        if (!store) {
          return {
            tags: [],
            data: [],
            lastTimeUpdate: 0,
          };
        }

        if(store.data && !isArray(store.data)) {
          store.oldData = store.data;

          localStorage.setItem(KEY_OLD_DATA, JSON.stringify(store.oldData));

          store.data = [];
        }

        return store;
      }),
      catchError((error) => {
        return of({
          tags: [],
          data: [],
          lastTimeUpdate: 0,
        });
      }),
    );
  }

  loadData(): Observable<LibraryItemV2[]> {
    return this.load().pipe(
      pluck('data'),
    );
  }

  loadLastTimeUpdate(): Observable<number> {
    return this.load().pipe(
      pluck('lastTimeUpdate'),
    );
  }
}

export const libraryApi = new LibraryApi();
