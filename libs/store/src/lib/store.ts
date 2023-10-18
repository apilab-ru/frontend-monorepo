import { BehaviorSubject, combineLatest, Observable, throwError } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

abstract class StoreMethods<T> {
  abstract select<S extends keyof T>(selector: S): Observable<T[S]>;
  abstract select(): Observable<T>;

  abstract reload<S extends keyof T>(key: S, observable: Observable<T[S]> | BehaviorSubject<T[S]>): void;
  abstract update(data: Partial<T>): void;
  abstract get(): T;
}

type StoreFields<T> = { [key in keyof T]: BehaviorSubject<T[key]> };
export type RecordSubject<T> = StoreFields<T> & StoreMethods<T>;

// TODO предусмотреть сохранение в неправильном формате
export function makeStore<Store extends object, ReactiveStore extends Partial<StoreFields<Store>>>(
  data: Store,
  reactiveStore?: ReactiveStore
): RecordSubject<Store> {
  const store = {} as StoreFields<Store>;
  for (const key in data) {
    // @ts-ignore
    store[key] = new BehaviorSubject<typeof data[typeof key]>(data[key]);
  }
  const keys = Object.keys(data);

  // @ts-ignore
  const subjects = [];
  Object.values(store).forEach((subject, index) => {
    subjects.push((subject as BehaviorSubject<unknown>).pipe(
      // @ts-ignore
      startWith(data[keys[index]])
    ))
  });

  // @ts-ignore
  (store as RecordSubject<Store>).select = (selector?: keyof Store) => {
    if (selector) {

      if (!store[selector]) {
        return throwError(() => `Selector ${selector as string} not found`);
      }

      // @ts-ignore
      return store[selector].asObservable ? store[selector].asObservable() : store[selector];
    }

    // @ts-ignore
    return combineLatest(subjects).pipe(
      map((list) => {
        return keys.reduce((obj, key, index) => {
          // @ts-ignore
          obj[key] = list[index];
          return obj;
        }, {}) as Store;
      }),
      startWith(data),
    )
  };

  (store as StoreMethods<Store>).reload = (key:  keyof Store, observable) => {
    // @ts-ignore
    store[key] = observable;
  }

  if (reactiveStore) {
    Object.entries(reactiveStore).forEach(([key, observable]) => {
      (store as StoreMethods<Store>).reload(key as keyof Store, observable as Observable<Store[keyof Store]>);
    })
  }

  // @ts-ignore
  (store as RecordSubject<Store>).select = (selector?: keyof Store) => {
    if (selector) {

      if (!store[selector]) {
        return throwError(() => `Selector ${selector as string} not found`);
      }

      // @ts-ignore
      return store[selector].asObservable ? store[selector].asObservable() : store[selector];
    }

    // @ts-ignore
    return combineLatest(subjects).pipe(
      map((list) => {
        return keys.reduce((obj, key, index) => {
          // @ts-ignore
          obj[key] = list[index];
          return obj;
        }, {}) as Store;
      }),
      startWith(data),
    );
  };

  (store as RecordSubject<Store>).get = () => {
    return keys.reduce((prev, key) => ({
      ...prev,
      // @ts-ignore
      [key]: store[key].getValue(),
    }), {}) as Store;
  }

  (store as RecordSubject<Store>).update = (data) => {
    Object.entries(data).forEach(([key, value]) => {
      // @ts-ignore
      store[key].next(value);
    })
  }

  return store as RecordSubject<Store>;
}
