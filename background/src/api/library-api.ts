import { Observable, of } from 'rxjs';
import { Library } from '@shared/models/library';
import { catchError, map, pluck, tap } from 'rxjs/operators';
import { chromeStoreApi } from './chrome-store.api';
import { LibraryItem } from '@server/models';
import { Tag } from '@shared/models/tag';

class LibraryApi {
  load(): Observable<Library> {
    return chromeStoreApi.getStore<Library>().pipe(
      map(store => {

        if (!store) {
          store = {
            tags: [],
            data: {},
            lastTimeUpdate: 0,
          };
        }

        if (!store.data) {
          store.data = {};
        }

        if (!store.tags) {
          store.tags = [];
        }

        return store;
      }),
      catchError((error) => {
        // captureException(error);

        return of({
          tags: [],
          data: {},
          lastTimeUpdate: 0,
        });
      }),
    );
  }

  loadData(): Observable<Record<string, LibraryItem[]>> {
    return this.load().pipe(
      pluck('data'),
    );
  }

  loadTags(): Observable<Tag[]> {
    return this.load().pipe(
      pluck('tags'),
    );
  }

  loadLastTimeUpdate(): Observable<number> {
    return this.load().pipe(
      pluck('lastTimeUpdate'),
    );
  }
}

export const libraryApi = new LibraryApi();
