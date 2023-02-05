import { Action } from '@ngrx/store';
import { State } from '../state';
import { TaskMapItem } from '../../models/task-map-item';
import { UpdateEvent } from '../../models/update-event';

export const DELETE = '[TaskMap] Delete';
export const ADD = '[TaskMap] Add';
export const UPDATE = '[TaskMap] Update';
export const SET_LIST = '[TaskMap] SetList';

export class SetList implements Action {
  readonly type = SET_LIST;

  constructor(public payload: TaskMapItem[]) {
  }
}

export class Delete implements Action {
  readonly type = DELETE;

  constructor(public payload: number) {
  }
}

export class Add implements Action {
  readonly type = ADD;

  constructor(public payload: TaskMapItem) {
  }
}

export class Update implements Action {
  readonly type = UPDATE;

  constructor(public payload: UpdateEvent<TaskMapItem>) {
  }
}

export type TaskMapAction = Delete | Add | Update | SetList;
