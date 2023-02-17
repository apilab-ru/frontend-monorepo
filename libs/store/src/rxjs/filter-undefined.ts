import { filter, OperatorFunction } from 'rxjs';

export function filterUndefined<T>(): OperatorFunction<T | undefined, T> {
  return filter<T | undefined, T>((value): value is T => value !== undefined);
}
