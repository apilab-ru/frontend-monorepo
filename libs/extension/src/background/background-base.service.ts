import { WorkerAction } from './const';
import { FetchEventData, ReducerEventData, WorkerEvent, WorkerEventData } from './interface';
import { BehaviorSubject, filter, finalize, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';

import { ChromeMessageApi  } from "./api/chrome-message.api";
import { EXSEnvironment } from "./environment";

type Parameters<T> = T extends (arg: infer T) => any ? T : never;
type ReturnType<T> = T extends (arg?: any) => infer T ? T : never;

function log(...messages: any[]): void {
  //console.log('xxx messages', messages);
}

export class EXSBackgroundBaseService<Store, API, Reducers> {
  private id = Math.random();
  private responseQuery$ = new BehaviorSubject<WorkerEvent[]>([]);
  private chromeApi = new ChromeMessageApi();

  constructor(
    private environment: EXSEnvironment,
  ) {
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
    );
  }

  fetch<Api extends keyof API, Method extends keyof API[Api]>
  (api: Api, method: Method): (args: Parameters<API[Api][Method]>) => ReturnType<API[Api][Method]> {
    return (args) => {
      const id = this.makeId();

      this.sendMessage(WorkerAction.fetch, {
        class: api,
        method,
        args,
      } as FetchEventData<API>, id);

      return this.listenEvents(id).pipe(
        take(1),
        switchMap(event => {
          if (event!.status === 'error') {
            return throwError(() => event!.data);
          }

          return of(event!.data);
        }),
      ) as ReturnType<API[Api][Method]>;
    };
  }

  reduce<Api extends keyof Reducers, Method extends keyof Reducers[Api]>
  (api: Api, method: Method): (data: Parameters<Reducers[Api][Method]>) => ReturnType<Reducers[Api][Method]> {
    return (data) => {
      const id = this.makeId();

      this.sendMessage(WorkerAction.reducer, {
        class: api,
        method,
        data,
      } as ReducerEventData<Reducers>, id);

      return this.listenEvents(id).pipe(
        take(1),
        switchMap(event => {
          if (event!.status === 'error') {
            return throwError(() => event!.data);
          }

          return of(event!.data);
        }),
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

  private sendMessage(action: WorkerAction, data: WorkerEventData<Store, API, Reducers> | undefined, id: string): void {
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
