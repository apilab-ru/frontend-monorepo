import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@environments';

class ChromeStoreApi {

  onStoreChanges<T>(): Observable<Partial<T>> {
    return new Observable<Partial<T>>((resolve) => {
      chrome.storage.onChanged.addListener(result => {
        const updates: Partial<T> = Object.keys(result)
          .reduce((obj, key) => ({ ...obj, [key]: result[key].newValue }), {});

        resolve.next(updates);
      });
    });
  }

  setStore<T>(store: T): Promise<void> {
    return chrome.storage.local.set(store);
  }

  getStore<T>(): Observable<T> {
    return new Observable<T>((resolve) => {
      chrome.storage.local.get((res) => {
        resolve.next(res as undefined as T);
      });
    });
  }

  setGlobalStorage<T>(data: T): Promise<void> {
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

class ChromeStoreApiMock implements ChromeStoreApi {
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

  setStore<T>(store: T): Promise<void> {
    // @ts-ignore
    this.storeLocal.next(store);
    return Promise.resolve();
  }

  getStore<T>(): Observable<T> {
    return this.storeLocal.asObservable() as Observable<T>;
  }

  setGlobalStorage<T>(data: T): Promise<void> {
    this.storeGlobal.next(data);
    return Promise.resolve();
  }

  getGlobalStorage<T>(): Observable<T> {
    return this.storeGlobal.asObservable() as Observable<T>;
  }
}

export const chromeStoreApi = (environment.useBrowser)
  ? new ChromeStoreApiMock(environment.backgroundUrl)
  : new ChromeStoreApi();
