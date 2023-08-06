import { BehaviorSubject, firstValueFrom, Observable, pluck, switchMap } from 'rxjs';
import { EXSEnvironment } from "../environment";

export class ChromeStoreApi {
  onStoreChanges<T>(): Observable<Partial<T>> {
    return new Observable<Partial<T>>((resolve) => {
      chrome.storage.onChanged.addListener(result => {
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
      chrome.storage.local.get((res) => {
        resolve.next(res as unknown as T);
      });
    }).pipe(
      pluck(selector || '')
    );
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

export class ChromeStoreApiMock implements ChromeStoreApi {
  private storeLocal = new BehaviorSubject({});
  private storeGlobal = new BehaviorSubject({});

  constructor(private backgroundUrl: string) {
    fetch(this.backgroundUrl + '/backup.json', {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(res => {
      return res.json();
    }).then(data => {
      this.storeLocal.next(data);
    })
  }

  onStoreChanges<T>(): Observable<Partial<T>> {
    // @ts-ignore
    return this.storeLocal.asObservable();
  }

  pathStore<T>(key: string, store: T): Promise<void> {
    return firstValueFrom(this.getStore()).then(allData => {
      // @ts-ignore
      allData[key] = store;

      return this.setStore(allData);
    })
  }

  setStore<T>(store: T): Promise<void> {
    // @ts-ignore
    this.storeLocal.next(store);
    return Promise.resolve();
  }

  getStore<T>(): Observable<T>;
  getStore<T>(selector: string): Observable<T>;
  getStore<T>(selector?: string): Observable<unknown> {
    return this.storeLocal.asObservable() as Observable<T>;
  }

  setGlobalStorage<T extends {}>(data: T): Promise<void> {
    this.storeGlobal.next(data);
    return Promise.resolve();
  }

  getGlobalStorage<T>(): Observable<T> {
    return this.storeGlobal.asObservable() as Observable<T>;
  }
}

export const makeChromeStoreApi = (environment: EXSEnvironment) => environment.useBrowser
  ? new ChromeStoreApiMock(environment.backgroundUrl)
  : new ChromeStoreApi();
