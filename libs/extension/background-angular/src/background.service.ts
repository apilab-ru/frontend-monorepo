import { NgZone } from '@angular/core';

import { Observable, OperatorFunction } from 'rxjs';

//import { runInZone } from "@angular-shared";
export function runInZone<T>(zone: NgZone): OperatorFunction<T, T> {
  return (source) => {
    return new Observable(observer => {
      const next = (value: T) => zone.run(() => observer.next(value));
      const error = (e: any) => zone.run(() => observer.error(e));
      const complete = () => zone.run(() => observer.complete());
      return source.subscribe({
        next, error, complete,
      });
    });
  };
}

import { EXSBackgroundBaseService } from "../../background/src/background-base.service";

type Parameters<T> = T extends (arg: infer T) => any ? T : never;
type ReturnType<T> = T extends (arg?: any) => infer T ? T : never;

function log(...messages: any[]): void {}

export class EXSBackgroundService<Store, API, Reducers> extends EXSBackgroundBaseService<Store, API, Reducers> {
  constructor(
    private ngZone: NgZone,
  ) {
    super();
  }

  override select<S extends keyof Store>(selector: S): Observable<Store[S]> {
    return super.select(selector).pipe(
      runInZone(this.ngZone),
    );
  }

  override fetch<Api extends keyof API, Method extends keyof API[Api]>
  (api: Api, method: Method): (args: Parameters<API[Api][Method]>) => ReturnType<API[Api][Method]> {
    // @ts-ignore
    return (args) => super.fetch(api, method)(args)?.pipe(
      runInZone(this.ngZone),
    )
  }

  override reduce<Api extends keyof Reducers, Method extends keyof Reducers[Api]>
  (api: Api, method: Method): (data: Parameters<Reducers[Api][Method]>) => ReturnType<Reducers[Api][Method]> {
    // @ts-ignore
    return (data) => super.reduce(api, method)(data)?.pipe(
      runInZone(this.ngZone),
    );
  }
}
