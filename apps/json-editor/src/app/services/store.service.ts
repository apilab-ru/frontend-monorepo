import { Injectable } from '@angular/core';
import { JsonFile } from "../interface";

interface DataBase<T> {
  jsonFiles: JsonFile<T>[];
}

@Injectable({
  providedIn: 'root'
})
export class StoreService<T> {
  private indexDb: Promise<IDBDatabase>;

  constructor() {
    this.indexDb = new Promise((resolve, reject) => {
      const request = indexedDB.open('jsonEditor', 2);
      request.onerror = (er) => {
        console.error(er);
        reject(er);
      }
      request.onsuccess = () => {
        resolve(request.result);
      }

      request.onupgradeneeded = () => this.initDb(request.result);
    })
  }

  readJsonFile(): Promise<JsonFile<T> | null> {
    return this.indexDb.then(db => this.dbTransactionSelect(db, 'jsonFiles')).then(res => {
      if (!res) {
        return null;
      }

      return {
        name: (res as JsonFile<T>).name,
        data: JSON.parse((res as any).data)
      };
    });
  }

  saveJsonFile<T>(file: T, name: string): Promise<void> {
    return Promise.all([
      this.readJsonFile(),
      this.indexDb
    ]).then(([oldFile, db]) => {
      if (!oldFile) {
        return this.dbTransactionAdd(db, 'jsonFiles', { id: 1, data: JSON.stringify(file), name })
      }

      return this.dbTransactionUpdate(db, 'jsonFiles', { id: 1, data: JSON.stringify(file), name });
    })
  }

  private dbTransactionUpdate<D, Key extends keyof DataBase<T>>(db: IDBDatabase, key: Key, data: D): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([key], 'readwrite');

      transaction.onerror = () => {
        reject(transaction.error);
      };

      const objectStore = transaction.objectStore(key);
      const objectStoreRequest = objectStore.put(data);

      objectStoreRequest.onsuccess = () => {
        resolve();
      }
    })
  }

  private dbTransactionAdd<D, Key extends keyof DataBase<T>>(db: IDBDatabase, key: Key, data: D): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([key], 'readwrite');

      transaction.onerror = () => {
        reject(transaction.error);
      };

      const objectStore = transaction.objectStore(key);
      const objectStoreRequest = objectStore.add(data);

      objectStoreRequest.onsuccess = () => {
        resolve();
      }
    })
  }

  private dbTransactionSelect<D, Key extends keyof DataBase<T>>(db: IDBDatabase, key: Key): Promise<D | null> {
    return new Promise((resolve, reject) => {
      const objectStore = db.transaction(key).objectStore(key);

      const cursorRequest = objectStore.openCursor();
      cursorRequest.onsuccess = (event) => {
        const cursor = (event.target as any).result;

        if (!cursor) {
          return resolve(null);
        }

        resolve(cursor.value);
      }
      cursorRequest.onerror = error => reject(error);
    })
  }

  private initDb(db: IDBDatabase): void {
    db.onerror = error => console.error(error);

    db.createObjectStore('jsonFiles', {
      keyPath: "id",
      autoIncrement: true
    })
  }
}
