import { BehaviorSubject, combineLatest, Observable, throwError } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

abstract class StoreMethods<T> {
  abstract select<S extends keyof T>(selector: S): Observable<T[S]>;
  abstract select(): Observable<T>;
  abstract reload<S extends keyof T>(key: S, observable: Observable<T[S]>): void;
}

type StoreFields<T> = { [key in keyof T]: BehaviorSubject<T[key]> };
export type RecordSubject<T> = StoreFields<T> & StoreMethods<T>;

export function makeStore<T extends Object, C extends Object>(data: T): RecordSubject<T> {
  const store = {} as StoreFields<T>;
  for (let key in data) {
    // @ts-ignore
    store[key] = new BehaviorSubject<typeof data[typeof key]>(data[key]);
  }
  const keys = Object.keys(data);

  // @ts-ignore
  const subjects = [];
  Object.values(store).forEach((subject, index) => {
    subjects.push((subject as BehaviorSubject<any>).pipe(
      // @ts-ignore
      startWith(data[keys[index]])
    ))
  });

  // @ts-ignore
  (store as RecordSubject<T>).select = (selector?: keyof T) => {
    if (selector) {

      if (!store[selector]) {
        return throwError(() => `Selector ${selector as string} not found`)
      }

      return store[selector];
    }

    // @ts-ignore
    return combineLatest(subjects).pipe(
      map((list) => {
        return keys.reduce((obj, key, index) => {
          // @ts-ignore
          obj[key] = list[index];
          return obj;
        }, {}) as T;
      }),
      startWith(data),
    )
  };

  (store as StoreMethods<T>).reload = (key:  keyof T, observable) => {
    // @ts-ignore
    store[key] = observable;
  }

  return store as RecordSubject<T>;
}
