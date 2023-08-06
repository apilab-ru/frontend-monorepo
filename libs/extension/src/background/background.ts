import { FetchEventData, ReducerEventData, SelectData, WorkerEvent } from './interface';
import { WorkerAction } from './const';
import { filter, Observable, of, Subject, takeUntil, throwError } from 'rxjs';

import { ChromeMessage, makeChromeApi } from "./api/chrome-message.api";
import { EXSEnvironment } from "./environment";
import { RecordSubject } from "@store/lib/store";

export class EXSBackgroundWorker<Store, API, Reducers> {
  private closeRequest$ = new Subject<string>();
  private chromeApi: ChromeMessage;

  constructor(
    private environment: EXSEnvironment,
    private store: RecordSubject<Store>,
    private reducers: Reducers,
    private allApi: API,
    protected logger = (...messages: any[]) => {}
  ) {
    this.chromeApi = makeChromeApi(environment);

    this.postMessage = this.chromeApi.postMessage.bind(this.chromeApi);
  }

  init(): void {
    this.chromeApi.startWorker(event => this.handleMessage(event));
  }

  postMessage: (message: WorkerEvent) => void;

  handleMessage(event: WorkerEvent): void {
    this.logger(event);

    switch (event.action) {
      case WorkerAction.close:
        const id = event.id;
        this.closeRequest$.next(id);
        break;

      case WorkerAction.reducer:
        this.handleReducer(event as WorkerEvent<ReducerEventData<unknown>>);
        break;

      case WorkerAction.select:
        this.handleSelect(event as WorkerEvent<SelectData<unknown>>);
        break;

      case WorkerAction.fetch:
        this.handleFetch(event as WorkerEvent<FetchEventData<unknown>>);
        break;
    }
  }

  private handleSelect(event: WorkerEvent<SelectData<unknown>>): void {
    const id = event.id;
    const selector = event.data as unknown as keyof Store;

    this.store.select(selector).pipe(
      filter(data => data !== undefined),
      takeUntil(this.onClose(id)),
    ).subscribe({
      next: (data: any) => {
        this.logger('xxx data select', event, data);

        this.postMessage({
          action: WorkerAction.select,
          status: 'success',
          data,
          id,
        });
      },
      error: (data: any) => {
        this.postMessage({
          action: WorkerAction.select,
          status: 'error',
          data,
          id,
        });
      },
    });
  }

  private handleFetch(event: WorkerEvent<FetchEventData<unknown>>): void {
    const id = event.id;
    const data = event.data;
    // @ts-ignore
    this.allApi[data.class][data.method](...data.args)
      .subscribe({
        next: (res: any) => {
          this.postMessage({
            action: WorkerAction.fetch,
            data: res,
            status: 'success',
            id,
          });
        },
        error: (res: any) => {
          this.postMessage({
            action: WorkerAction.fetch,
            data: res,
            status: 'error',
            id,
          });
        },
      });
  }

  private handleReducer(event: WorkerEvent<ReducerEventData<unknown>>): void {
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
      }),
      error: error => this.postMessage({
        action: WorkerAction.reducer,
        id,
        data: error,
        status: 'error',
      }),
    });
  }

  private onClose(id: string): Observable<string> {
    return this.closeRequest$.pipe(
      filter(closedId => closedId === id),
    );
  }
}
