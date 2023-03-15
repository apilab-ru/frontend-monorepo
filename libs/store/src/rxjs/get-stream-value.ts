import { Observable, Subject, take, takeUntil } from "rxjs";

export function getStreamValue<T>(stream$: Observable<T>, defaultValue?: T): T {
  let hasValue = false;
  let value: T | null = null;
  const abort = new Subject<void>();

  stream$.pipe(take(1), takeUntil(abort)).subscribe(streamValue => {
    hasValue = true;
    value = streamValue;
  });

  if (!hasValue) {
    if (defaultValue !== undefined) {
      abort.next();

      return defaultValue;
    } else {
      throw new Error('Not emit event');
    }
  }

  return value!;
}