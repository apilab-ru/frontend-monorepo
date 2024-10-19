import { firstValueFrom, Observable } from 'rxjs';

export class ChromeStoreApi {
  onStoreChanges<T>(): Observable<Partial<T>> {
    return new Observable<Partial<T>>((resolve) => {
      chrome.storage.onChanged.addListener((result) => {
        const updates: Partial<T> = Object.keys(result)
          .reduce((obj, key) => ({ ...obj, [key]: result[key].newValue }), {});

        resolve.next(updates);
      });
    });
  }

  setStore(store: any): Promise<void> {
    return chrome.storage.local.set(store);
  }

  pathStore<T>(key: string, store: T): Promise<void> {
    return firstValueFrom(this.getStore()).then(allData => {

      const storeData: Record<string, unknown> = (allData ? allData : {}) as Record<string, unknown>;

      storeData[key] = store;

      return this.setStore(storeData);
    })
  }

  getStore<T>(): Observable<T>;
  getStore<T>(selector: string): Observable<T>;
  getStore<T>(selector?: string): Observable<unknown>
  {
    return new Observable<T>((resolve) => {
      chrome.storage.local.get((res: any) => {
        const needResult = selector ? res?.[selector] : res;

        if (!needResult || JSON.stringify(needResult) === '{}') {
          return resolve.next(undefined);
        }

        resolve.next(needResult);
      });
    });
  }

  setGlobalStorage<T extends {}>(data: T): Promise<void> {
    return chrome.storage.sync.set(data);
  }

  getGlobalStorage<T>(): Observable<T> {
    return new Observable<T>((resolve) => {
      // @ts-ignore
      chrome.storage.sync.get(null, (result: T) => {
        resolve.next(result);
      });
    });
  }
}
