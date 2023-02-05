import { Action } from '@ngrx/store';

export const UNDO = '[History] Undo';

export class Undo implements Action {
  readonly type = UNDO;
}

export type SharedAction = Undo;
