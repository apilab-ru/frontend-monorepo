import { environment } from '@environments';

import { FetchEventData, ReducerEventData, SelectData, WorkerEvent } from './interface';
import { WorkerAction } from './const';
import { allApi } from './api';
import { Store, store$ } from './store';
import { filter, Observable, of, Subject, takeUntil, throwError } from 'rxjs';
import { reducers } from './reducers';

class BackgroundWorker {
  private closeRequest$ = new Subject<string>();

  onConnect(event: MessageEvent): void {
    const [port] = event.ports;

    port.onmessage = message => this.handleMessage(message, port);

    port.start();
  }

  handleMessage(message: MessageEvent, port: MessagePort): void {
    const event = message.data as WorkerEvent;
    //console.log('xxx worker handle', event);

    switch (event.action) {
      case WorkerAction.close:
        const id = event.id;
        this.closeRequest$.next(id);
        break;

      case WorkerAction.reducer:
        this.handleReducer(event as WorkerEvent<ReducerEventData>, port);
        break;

      case WorkerAction.select:
        this.handleSelect(event as WorkerEvent<SelectData>, port);
        break;

      case WorkerAction.fetch:
        this.handleFetch(event as WorkerEvent<FetchEventData>, port);
        break;
    }
  }

  private handleSelect(event: WorkerEvent<SelectData>, port: MessagePort): void {
    const id = event.id;
    const selector = event.data as keyof Store;
    store$.select(selector).pipe(
      filter(data => data !== undefined),
      takeUntil(this.onClose(id)),
    ).subscribe({
      next: (data: any) => {
        console.log('xxx send', event, data);

        port.postMessage({
          action: WorkerAction.select,
          status: 'success',
          data,
          id,
        });
      },
      error: (data: any) => {
        //console.log('xxx error', event, data);

        port.postMessage({
          action: WorkerAction.select,
          status: 'error',
          data,
          id,
        });
      },
    });
  }

  private handleFetch(event: WorkerEvent<FetchEventData>, port: MessagePort): void {
    const id = event.id;
    const data = event.data;
    // @ts-ignore
    allApi[data.class][data.method](...data.args)
      .subscribe({
        next: (res: any) => {
          port.postMessage({
            action: WorkerAction.fetch,
            data: res,
            status: 'success',
            id,
          });
        },
        error: (res: any) => {
          port.postMessage({
            action: WorkerAction.fetch,
            data: res,
            status: 'error',
            id,
          });
        },
      });
  }

  private handleReducer(event: WorkerEvent<ReducerEventData>, port: MessagePort): void {
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
      next: res => port.postMessage({
        action: WorkerAction.reducer,
        id,
        data: res,
        status: 'success',
      }),
      error: error => port.postMessage({
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

self.addEventListener('connect', event => backgroundWorker.onConnect(event as MessageEvent));
