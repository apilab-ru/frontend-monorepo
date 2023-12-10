import { Observable, ObservableInput, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

export type ObservableReturnType<T> = T extends Observable<infer R> ? R : unknown;

export type ObjectWithObservableReturnTypes<T> = {
  [P in keyof T]: ObservableReturnType<T[P]>
};

export function combineToObject<TObj extends { [key: string]: ObservableInput<unknown> }>(
  streams: TObj,
): Observable<ObjectWithObservableReturnTypes<TObj>> {
  const keys = Object.keys(streams);

  return combineLatest(Object.values(streams)).pipe(
    map(resultArray => {
      const result: Record<string, unknown> = {} as ObjectWithObservableReturnTypes<TObj>;

      keys.forEach((key, index) => result[key] = resultArray[index]);

      return result;
    }),
  ) as Observable<ObjectWithObservableReturnTypes<TObj>>;
}