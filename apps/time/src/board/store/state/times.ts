import { TimeItem } from '../../models/time-item';
import { Calc } from '../../models/calc';

export const INITIAL_TIME_STATE = {
  list: [] as TimeItem[],
  calculatedList: [] as Calc[],
};

export type TimeState = typeof INITIAL_TIME_STATE;
