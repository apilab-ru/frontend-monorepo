import { Injectable, NgZone } from '@angular/core';
import { IDbStoreService, makeStore } from '@utils-monorep/store';
import { DBStore, JsonData, JsonFile, Tab } from '../interface';
import { DB_STORE_CONFIG } from '../const';
import { from, map, Observable, shareReplay, switchMap, tap } from "rxjs";
import { runInZone } from "@utils-monorep/angular-shared";

const STORE = {
  files: [] as JsonFile[],
}

@Injectable({
  providedIn: 'root',
})
export class JsonDataService {
  private dbService = new IDbStoreService<DBStore>(DB_STORE_CONFIG);
  private store = makeStore(STORE);

  files$: Observable<JsonFile[]>;
  fileNames$: Observable<Tab[]>;

  constructor(
    private ngZone: NgZone,
  ) {
    this.files$ = from(this.dbService.selectList('jsonFiles')).pipe(
      tap(list => this.store.files.next(list)),
      switchMap(() => this.store.files.asObservable()),
      runInZone(this.ngZone),
      shareReplay({ refCount: false, bufferSize: 1 }),
    )

    this.fileNames$ = this.files$.pipe(
      map(list => list.map(({ name, id }) => ({ name, id }))),
    )
  }

  loadFileData(id: number): Observable<JsonData | null> {
    return this.files$.pipe(
      map(list => {
        const item = list.find(item => item.id === id);

        if (!item) {
          return null;
        }

        return item.data as unknown as JsonData;
      }),
    )
  }

  updateFile(file: JsonFile): Promise<void> {
    return this.dbService.updateItem('jsonFiles', file).then(() => {
      const list = this.store.files.getValue();
      const index = list.findIndex(it => it.id === file.id);
      const newList = [
        ...list.slice(0, index),
        file,
        ...list.slice(index + 1)
      ];
      this.store.files.next(newList);
    });
  }

  deleteFile(id: number): Promise<void> {
    return this.dbService.deleteItem('jsonFiles', id).then(() => {
      this.store.files.next(
        this.store.files.getValue().filter(it => it.id !== id)
      );
    });
  }

  addFile(data: JsonData, name: string): Promise<void> {
    return this.dbService
      .addItem('jsonFiles', {
        data,
        name,
      })
      .then((file) => {
        this.store.files.next([
          ...this.store.files.getValue(),
          file,
        ])
      });
  }
}
