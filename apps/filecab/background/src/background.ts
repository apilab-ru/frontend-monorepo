import { environment } from '@environments';

import { FetchEventData, ReducerEventData, SelectData, WorkerEvent } from './interface';
import { WorkerAction } from './const';
import { allApi } from './api';
import { Store, store$ } from './store';
import { filter, Observable, of, Subject, takeUntil, throwError } from 'rxjs';
import { reducers } from './reducers';
import { makeChromeApi } from "./api/chrome-message.api";

console.log('xxx store', store$);

class BackgroundWorker {
  private closeRequest$ = new Subject<string>();
  postMessage: (message: WorkerEvent) => void;

  handleMessage(event: WorkerEvent): void {
    switch (event.action) {
      case WorkerAction.close:
        const id = event.id;
        this.closeRequest$.next(id);
        break;

      case WorkerAction.reducer:
        this.handleReducer(event as WorkerEvent<ReducerEventData>);
        break;

      case WorkerAction.select:
        this.handleSelect(event as WorkerEvent<SelectData>);
        break;

      case WorkerAction.fetch:
        this.handleFetch(event as WorkerEvent<FetchEventData>);
        break;
    }
  }

  private handleSelect(event: WorkerEvent<SelectData>): void {
    const id = event.id;
    const selector = event.data as keyof Store;

    store$.select(selector).pipe(
      filter(data => data !== undefined),
      takeUntil(this.onClose(id)),
    ).subscribe({
      next: (data: any) => {
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

  private handleFetch(event: WorkerEvent<FetchEventData>): void {
    const id = event.id;
    const data = event.data;
    // @ts-ignore
    allApi[data.class][data.method](...data.args)
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

  private handleReducer(event: WorkerEvent<ReducerEventData>): void {
    const id = event.id;
    const data = event.data;

    let asyncResult;
    try {
      // @ts-ignore
      const result = reducers[data.class][data.method](data.data) as Observable<unknown> | undefined;
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
        data: res,
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

const backgroundWorker = new BackgroundWorker();

const chromeApi = makeChromeApi(environment);
backgroundWorker.postMessage = chromeApi.postMessage.bind(chromeApi);
chromeApi.startWorker(event => backgroundWorker.handleMessage(event));
