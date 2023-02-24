import { Injectable, NgZone } from '@angular/core';
import { Environment } from '@environments/model';
import { allApi } from './api';
import { WorkerAction } from './const';
import { FetchEventData, ReducerEventData, WorkerEvent, WorkerEventData } from './interface';
import { BehaviorSubject, filter, finalize, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Store } from './store';
import { runInZone } from '@shared/helpers/rxjs-ng-zone';
import { Reducers } from './reducers';
import { ChromeMessage, makeChromeApi } from "./api/chrome-message.api";

type AllApiTypes = typeof allApi;
type Parameters<T> = T extends (...args: infer T) => any ? T : never;
type ReturnType<T> = T extends (...args: any[]) => infer T ? T : never;

function log(...messages: any[]): void {}

@Injectable({ providedIn: 'root' })
export class BackgroundService {
  private id = Math.random();
  private responseQuery$ = new BehaviorSubject<WorkerEvent[]>([]);
  private chromeApi: ChromeMessage;

  constructor(
    private environment: Environment,
    private ngZone: NgZone,
  ) {
    this.chromeApi = makeChromeApi(environment);
    this.chromeApi.connectToWorker((event: WorkerEvent) => this.handleMessage(event));
  }

  select<S extends keyof Store>(selector: S): Observable<Store[S]> {
    const id = this.makeId();

    this.sendMessage(WorkerAction.select, selector, id);

    return this.listenEvents(id).pipe(
      switchMap(event => {
        if (event!.status === 'error') {
          return throwError(() => event.data);
        }

        return of(event.data as Store[S]);
      }),
      finalize(() => {
        this.sendMessage(WorkerAction.close, undefined, id);
      }),
      runInZone(this.ngZone),
    );
  }

  fetch<Api extends keyof AllApiTypes, Method extends keyof AllApiTypes[Api]>
  (api: Api, method: Method): (args: Parameters<AllApiTypes[Api][Method]>) => ReturnType<AllApiTypes[Api][Method]> {
    return (args) => {
      const id = this.makeId();

      this.sendMessage(WorkerAction.fetch, {
        class: api,
        method,
        args,
      } as FetchEventData, id);

      return this.listenEvents(id).pipe(
        take(1),
        switchMap(event => {
          if (event!.status === 'error') {
            return throwError(() => event!.data);
          }

          return of(event!.data);
        }),
        runInZone(this.ngZone),
      ) as ReturnType<AllApiTypes[Api][Method]>;
    };
  }

  reduce<Api extends keyof Reducers, Method extends keyof Reducers[Api]>
  (api: Api, method: Method): (data: Parameters<Reducers[Api][Method]>[0]) => ReturnType<Reducers[Api][Method]> {
    return (data) => {
      const id = this.makeId();

      this.sendMessage(WorkerAction.reducer, {
        class: api,
        method,
        data,
      } as ReducerEventData, id);

      return this.listenEvents(id).pipe(
        take(1),
        switchMap(event => {
          if (event!.status === 'error') {
            return throwError(() => event!.data);
          }

          return of(event!.data);
        }),
        runInZone(this.ngZone),
      ) as ReturnType<Reducers[Api][Method]>;
    };
  }

  private listenEvents<T>(id: string): Observable<WorkerEvent<T>> {
    return this.responseQuery$.pipe(
      tap(event => log('listen event', event)),
      map(list => list.find(event => event.id === id) as WorkerEvent<T>),
      filter(event => !!event),
      tap(event => {
        const allList = this.responseQuery$.value;
        const filtered = allList.filter(item => item.id !== id);
        this.responseQuery$.next(filtered);
      }),
    );
  }

  private sendMessage(action: WorkerAction, data: WorkerEventData, id?: string): void {
    this.chromeApi.postMessage({
      action,
      data,
      id,
    })
  }

  private handleMessage(event: WorkerEvent): void {
    const allList = this.responseQuery$.value;
    this.responseQuery$.next([...allList, event]);
  }

  private makeId(): string {
    return this.id + 'S' + Math.random() + 'T' + new Date().getTime();
  }
}
