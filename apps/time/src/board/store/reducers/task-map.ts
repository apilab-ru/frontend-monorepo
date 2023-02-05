import * as taskMapAction from '../actions/task-map';
import { INITIAL_STATE } from '../state';
import cloneDeep from 'lodash/cloneDeep';

export function reducer(state = INITIAL_STATE.taskMap, action: taskMapAction.TaskMapAction) {
  switch (action.type) {
    case taskMapAction.ADD: {
      return {
        ...state,
        list: [...state.list, action.payload]
      };
    }

    case taskMapAction.SET_LIST: {
      return {
        ...state,
        list: action.payload
      };
    }

    case taskMapAction.UPDATE: {
      const { index, item } = action.payload;
      const list = cloneDeep(state.list);
      list[index] = item;
      return {
        ...state,
        list
      };
    }

    case taskMapAction.DELETE: {
      const index = action.payload;
      const list = cloneDeep(state.list);
      list.splice(index, 1);
      return {
        ...state,
        list
      };
    }

    default:
      return state;
  }
}
