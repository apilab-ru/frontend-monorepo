import { Action as StoreAction, ActionReducer, INIT as StoreInit, MetaReducer } from '@ngrx/store';
import { Action, UNDO } from '../actions';
import { HistoryService } from '../../services/history.service';
import { TimeService } from '../../services/time.service';
import { State } from '../state';
import { TaskMapService } from '../../services/task-map.service';

const EffectsInit = '@ngrx/effects/init';

export class BaseAction implements StoreAction {
  readonly type = StoreInit || EffectsInit;

  constructor(public payload: number) {
  }
}

export function history(historyService: HistoryService): MetaReducer<State> {
  return function (reducer: ActionReducer<State>): ActionReducer<State> {
    return function (state: State, action: Action | BaseAction): State {
      if (action.type === UNDO) {
        const prevState = historyService.prevent();
        return prevState || state;
      }

      if (action.type === StoreInit) {
        return reducer({
          times: TimeService.getState(),
          taskMap: TaskMapService.loadTaskMap()
        }, action);
      }

      const newState = reducer(state, action);

      if (
        // action.type !== StoreInit
        action.type !== EffectsInit
      ) {
        TimeService.saveState(newState.times);
        TaskMapService.saveTaskMap(newState.taskMap);
        historyService.addState(newState);
      }

      return newState;
    };
  };
}
