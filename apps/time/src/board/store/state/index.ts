import { TASK_MAP_STATE } from './task-map';
import { INITIAL_TIME_STATE } from './times';

export const INITIAL_STATE = {
  times: INITIAL_TIME_STATE,
  taskMap: TASK_MAP_STATE
};

export type State = typeof INITIAL_STATE;
