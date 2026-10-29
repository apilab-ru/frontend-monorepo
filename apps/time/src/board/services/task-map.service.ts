import { computed, inject, Injectable } from '@angular/core';
import { TaskMap } from '../models/task-map';
import { Store } from '@ngrx/store';
import { State } from '../store/state';
import * as actions from '../store/actions/task-map';
import { TaskMapItem } from '../models/task-map-item';
import { TaskMapState } from '../store/state/task-map';

const KEY_TASK_MAP = 'task-map';

@Injectable({
  providedIn: 'root',
})
export class TaskMapService {
  private store = inject<Store<State>>(Store);

  taskMapList = this.store.selectSignal((state) => state.taskMap.list);
  taskMap = computed(() => this.fromArrayToMap(this.taskMapList()));

  addItem(): void {
    this.store.dispatch(
      new actions.Add({
        key: null,
        value: null,
      })
    );
  }

  deleteItem(index: number): void {
    this.store.dispatch(new actions.Delete(index));
  }

  updateItem(item: TaskMapItem, index: number): void {
    this.store.dispatch(
      new actions.Update({
        index,
        item,
      })
    );
  }

  getTaskMap(): TaskMap {
    return {};
  }

  private fromArrayToMap(list: TaskMapItem[]): TaskMap {
    return list.reduce((obj, item) => {
      obj[item.key] = item.value;

      return obj;
    }, {});
  }

  static saveTaskMap(state: TaskMapState): void {
    localStorage.setItem(KEY_TASK_MAP, JSON.stringify(state));
  }

  static loadTaskMap(): TaskMapState {
    const oldData = this.loadOldTaskMap();

    if (oldData) {
      return oldData;
    }

    try {
      const data = JSON.parse(localStorage.getItem(KEY_TASK_MAP));

      if (data) {
        return data;
      }
    } catch {
      // Ignore invalid saved data and use the fallback below.
    }

    return {
      list: [],
    };
  }

  private static loadOldTaskMap(): TaskMapState | null {
    let data;
    try {
      data = JSON.parse(localStorage.getItem('jira-integration-task-map'));
    } catch {
      // Ignore invalid saved data and use the fallback below.
    }

    if (!data) {
      return null;
    }

    delete localStorage['jira-integration-task-map'];

    return {
      list: this.fromMapToArray(data),
    };
  }

  private static fromMapToArray(obj: TaskMap): TaskMapItem[] {
    return Object.keys(obj).map((key) => ({ key, value: obj[key] }));
  }
}
