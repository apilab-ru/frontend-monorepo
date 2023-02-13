import { Observable } from 'rxjs';
import { CustomError } from '@shared/utils/custom-error';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export function fetchObservable<T>(
  path: string,
  method: Method = 'GET',
  body?: Object,
  token?: string,
): Observable<T> {
  return new Observable<T>((observer) => {
    const controller = new AbortController();

    fetch(new URL(path).href, {
      signal: controller.signal,
      method,
      ...(body ? { body: JSON.stringify(body) } : {}),
      headers: {
        ...(token ? { 'Authorization': 'Bearer ' + token } : {}),
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        return res.json().then(json => ({
          json,
          status: res.status,
        }));
      })
      .then(res => {
        if (![200, 201].includes(res.status)) {
          throw new CustomError(res.status, res.json?.error);
        } else {
          observer.next(res.json);
          observer.complete();
        }
      })
      .catch(err => {
        observer.error(err);
      });

    return () => {
      controller.abort();
      observer.complete();
    };
  });
}
