import { DbConfig } from './interface';

export class IDbStoreService<T> {
  private indexDb: Promise<IDBDatabase>;

  constructor(private config: DbConfig) {
    this.indexDb = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.name, this.config.version);

      request.onerror = (er) => {
        console.error(er);
        reject(er);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = () => this.initDb(request.result);
    });
  }

  select<Key extends keyof T>(key: Key, query?: IDBValidKey | IDBKeyRange | null, count?: number): Promise<T[Key][]> {
    return this.indexDb.then((db) => this.dbTransactionSelect(db, key, query, count));
  }

  selectList<Key extends keyof T>(key: Key): Promise<T[Key][]> {
    return this.indexDb.then((db) => this.dbTransactionSelect(db, key));
  }

  addItem<Key extends keyof T>(key: Key, data: T[Key]): Promise<T[Key]> {
    return this.indexDb
      .then((db) => this.dbTransactionAdd(db, key, data))
      .then((id) => ({
        ...data,
        id,
      }));
  }

  updateItem<Key extends keyof T>(key: Key, data: T[Key]): Promise<void> {
    return this.indexDb.then((db) => this.dbTransactionUpdate(db, key, data));
  }

  deleteItem<Key extends keyof T>(key: Key, id: IDBValidKey): Promise<void> {
    return this.indexDb.then((db) => this.dbTransactionDelete(db, key, id));
  }

  private dbTransactionDelete<Key extends keyof T>(
    db: IDBDatabase,
    key: Key,
    id: IDBValidKey
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([key as string], 'readwrite');

      transaction.onerror = () => reject(transaction.error);

      const objectStore = transaction.objectStore(key as string);
      const objectStoreRequest = objectStore.delete(id);

      objectStoreRequest.onsuccess = () => resolve();
      objectStoreRequest.onerror = () => reject(objectStoreRequest.error);
    });
  }

  private dbTransactionUpdate<Key extends keyof T>(
    db: IDBDatabase,
    key: Key,
    data: T[Key]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([key as string], 'readwrite');

      transaction.onerror = () => reject(transaction.error);

      const objectStore = transaction.objectStore(key as string);
      const objectStoreRequest = objectStore.put(data);

      objectStoreRequest.onsuccess = () => resolve();
      objectStoreRequest.onerror = () => reject(objectStoreRequest.error);
    });
  }

  private dbTransactionAdd<Key extends keyof T>(
    db: IDBDatabase,
    key: Key,
    data: T[Key]
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([key as string], 'readwrite');

      transaction.onerror = () => reject(transaction.error);

      const objectStore = transaction.objectStore(key as string);
      const objectStoreRequest = objectStore.add(data);

      objectStoreRequest.onsuccess = (state) => {
        resolve((state.target as any).result);
      };
      objectStoreRequest.onerror = () => reject(objectStoreRequest.error);
    });
  }

  private dbTransactionSelect<Key extends keyof T>(
    db: IDBDatabase,
    key: Key,
    query?: IDBValidKey | IDBKeyRange | null,
    count?: number
  ): Promise<T[Key][]> {
    return new Promise((resolve, reject) => {
      const objectStore = db
        .transaction(key as string)
        .objectStore(key as string);

      const cursorRequest = objectStore.getAll(query, count);

      cursorRequest.onsuccess = (event) => {
        const result = (event.target as any).result as T[Key][];
        resolve(result);
      };

      cursorRequest.onerror = (error) => reject(error);
    });
  }

  private initDb(db: IDBDatabase): void {
    db.onerror = (error) => console.error(error);

    this.config.objects.forEach((object) => {
      db.createObjectStore(object.name, object.options);

      object.values?.forEach(item => {
        // todo fix types
        this.addItem(object.name as keyof T, item as any);
      })
    });
  }
}
