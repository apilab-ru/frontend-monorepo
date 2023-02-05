import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromTimes from './times';
import * as fromTaskMap from './task-map';

import { State } from '../state';

export const reducers: ActionReducerMap<State> = {
  times: fromTimes.reducer,
  taskMap: fromTaskMap.reducer,
};

export const getTimesState = createFeatureSelector<State['times']>('times');

export const getList = createSelector(
  getTimesState,
  fromTimes.getList,
);

export const getCalcList = createSelector(
  getTimesState,
  fromTimes.getCalcList,
);
