import { Action } from '@ngrx/store';
import { TimeItem } from '../../models/time-item';
import { UpdateEvent } from '../../models/update-event';
import { Calc } from '../../models/calc';

export const DELETE = '[Times] Delete';
export const ADD = '[Times] Add';
export const SET_LIST = '[Times] SetList';
export const UPDATE = '[Times] Update';
export const CLEAR = '[Times] Clear';
export const RELOAD = '[Times] Reload';
export const SET_TASK_MAP = '[Times] SetTaskMap';


export const SET_CALCULATION_LIST = '[Times] SetCalculationList';
export const DELETE_CALCULATION_ITEM = '[Times] DeleteCalculationItem';

export class Delete implements Action {
  readonly type = DELETE;

  constructor(public payload: number) {
  }
}

export class Add implements Action {
  readonly type = ADD;

  constructor(public payload: TimeItem) {
  }
}

export class SetList implements Action {
  readonly type = SET_LIST;

  constructor(public payload: TimeItem[]) {
  }
}

export class Update implements Action {
  readonly type = UPDATE;

  constructor(public payload: UpdateEvent<TimeItem>) {
  }
}

export class Clear implements Action {
  readonly type = CLEAR;

  constructor() {
  }
}

export class Reload implements Action {
  readonly type = RELOAD;

  constructor() {
  }
}

export class SetCalculationList implements Action {
  readonly type = SET_CALCULATION_LIST;

  constructor(public payload: Calc[]) {
  }
}

export class DeleteCalculationItem implements Action {
  readonly type = DELETE_CALCULATION_ITEM;

  constructor(public payload: number) {
  }
}

export type TimesAction = Delete | Add | Update | Clear | Reload | SetCalculationList | DeleteCalculationItem | SetList;
