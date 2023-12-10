import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

export function reactiveStore<T>(resolver: () => Observable<T>, startValue?: T): BehaviorSubject<T> {
  const subject = new BehaviorSubject<T>(startValue!);
  const originalObservable = subject.asObservable;

  const value$ = resolver().pipe(
    tap(value => {
      if (value || !startValue) {
        subject.next(value)
      }
    }),
    switchMap(() => originalObservable.bind(subject)()),
    shareReplay({ refCount: false, bufferSize: 1 }),
  ) as Observable<T>;

  subject.asObservable = (): Observable<T> => value$;

  return subject;
}
