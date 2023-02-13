import { WorkerAction } from './const';
import { allApi } from './api';
import { Store } from './store';
import { Reducers } from './reducers';

export interface WorkerEvent<T = Object> {
  action: WorkerAction;
  id: string;
  status?: 'success' | 'error';
  data: T;
}

export type WorkerEventData = SelectData | FetchEventData | ReducerEventData | undefined;

export type SelectData = keyof Store;

export interface FetchEventData {
  class: keyof typeof allApi;
  method: string;
  args: unknown[];
}

export interface ReducerEventData {
  class: keyof Reducers;
  method: string;
  data: unknown;
}
