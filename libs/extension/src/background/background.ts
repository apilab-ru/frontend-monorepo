import { FetchEventData, ReducerEventData, SelectData, WorkerEvent } from './interface';
import { WorkerAction } from './const';
import { filter, Observable, of, Subject, takeUntil, throwError } from 'rxjs';

import { ChromeMessageApi } from "./api/chrome-message.api";
import { RecordSubject } from "@store/lib/store";

export class EXSBackgroundWorker<Store, API, Reducers> {
  private closeRequest$ = new Subject<string>();
  private chromeApi = new ChromeMessageApi();
  private postMessage = this.chromeApi.postMessage.bind(this.chromeApi);

  constructor(
    private store: RecordSubject<Store>,
    private reducers: Reducers,
    private allApi: API,
    protected logger = (...messages: any[]) => {}
  ) {
  }

  init(): void {
    this.chromeApi.startWorker((event, tabId) => this.handleMessage(event, tabId));
  }

  handleMessage(event: WorkerEvent, tabId?: number): void {
    this.logger(event, tabId);

    switch (event.action) {
      case WorkerAction.close:
        const id = event.id;
        this.closeRequest$.next(id);
        break;

      case WorkerAction.reducer:
        this.handleReducer(event as WorkerEvent<ReducerEventData<unknown>>, tabId);
        break;

      case WorkerAction.select:
        this.handleSelect(event as WorkerEvent<SelectData<unknown>>, tabId);
        break;

      case WorkerAction.fetch:
        this.handleFetch(event as WorkerEvent<FetchEventData<API>>, tabId);
        break;
    }
  }

  private handleSelect(event: WorkerEvent<SelectData<unknown>>, tabId?: number): void {
    const id = event.id;
    const selector = event.data as unknown as keyof Store;

    this.store.select(selector).pipe(
      filter(data => data !== undefined),
      takeUntil(this.onClose(id)),
    ).subscribe({
      next: (data: any) => {
        this.logger('xxx data select', event, data, tabId);

        this.postMessage({
          action: WorkerAction.select,
          status: 'success',
          data,
          id,
        }, tabId);
      },
      error: (data: any) => {
        this.postMessage({
          action: WorkerAction.select,
          status: 'error',
          data,
          id,
        }, tabId);
      },
    });
  }

  private handleFetch(event: WorkerEvent<FetchEventData<API>>, tabId?: number): void {
    const id = event.id;
    const data = event.data;
    // @ts-ignore
    this.allApi[data.class][data.method](data.args)
      .subscribe({
        next: (res: any) => {
          this.postMessage({
            action: WorkerAction.fetch,
            data: res,
            status: 'success',
            id,
          }, tabId);
        },
        error: (res: any) => {
          this.postMessage({
            action: WorkerAction.fetch,
            data: res,
            status: 'error',
            id,
          }, tabId);
        },
      });
  }

  private handleReducer(event: WorkerEvent<ReducerEventData<unknown>>, tabId?: number): void {
    const id = event.id;
    const data = event.data;

    let asyncResult;
    try {
      // @ts-ignore
      const result = this.reducers[data.class][data.method](data.data) as Observable<unknown> | undefined;
      asyncResult = !result ? of(result) : result;
    } catch (error) {
      asyncResult = throwError(error);
    }

    asyncResult.pipe(
      takeUntil(this.onClose(id)),
    ).subscribe({
      next: res => this.postMessage({
        action: WorkerAction.reducer,
        id,
        data: res as object,
        status: 'success',
      }, tabId),
      error: error =>  this.postMessage({
        action: WorkerAction.reducer,
        id,
        data: error?.message || error,
        status: 'error',
      }, tabId),
    });
  }

  private onClose(id: string): Observable<string> {
    return this.closeRequest$.pipe(
      filter(closedId => closedId === id),
    );
  }
}
