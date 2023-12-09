import { WorkerAction } from './const';

export interface WorkerEvent<T = Object> {
  action: WorkerAction;
  id: string;
  status?: 'success' | 'error';
  data: T | undefined;
}

export type WorkerEventData<Store, API, Reducers> = SelectData<Store> | FetchEventData<API> | ReducerEventData<Reducers>;

export type SelectData<Store> = keyof Store;

export interface FetchEventData<API> {
  class: keyof API;
  method: string;
  args: unknown[];
}

export interface ReducerEventData<Reducers> {
  class: keyof Reducers;
  method: string;
  data: unknown;
}
