import * as timesAction from '../actions/times';
import { TimeItem } from '../../models/time-item';
import { INITIAL_STATE, State } from '../state';
import cloneDeep from 'lodash/cloneDeep';


export function reducer(state = INITIAL_STATE.times, action: timesAction.TimesAction) {
  switch (action.type) {
    case timesAction.ADD: {
      const newItem: TimeItem = action.payload as TimeItem;
      return {
        ...state,
        list: [...state.list, newItem]
      };
    }

    case timesAction.SET_LIST: {
      return {
        ...state,
        list: action.payload
      };
    }

    case timesAction.UPDATE: {
      const { index, item } = action.payload;
      const list = cloneDeep(state.list);
      list[index] = item;
      return {
        ...state,
        list: list
      };
    }

    case timesAction.DELETE: {
      const index = action.payload;
      const list = cloneDeep(state.list);
      list.splice(index, 1);
      return {
        ...state,
        list
      };
    }

    case timesAction.CLEAR: {
      return {
        ...state,
        list: []
      };
    }

    case timesAction.SET_CALCULATION_LIST: {
      return {
        ...state,
        calculatedList: action.payload,
      };
    }

    case timesAction.DELETE_CALCULATION_ITEM: {
      const index = action.payload;
      const calculatedList = cloneDeep(state.calculatedList);
      calculatedList.splice(index, 1);
      return {
        ...state,
        calculatedList,
      };
    }

    default:
      return state;
  }
}

export const getList = (state: State['times']) => state.list;

export const getCalcList = (state: State['times']) => state.calculatedList;
