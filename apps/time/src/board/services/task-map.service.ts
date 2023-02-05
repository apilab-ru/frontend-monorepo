import { Injectable } from '@angular/core';
import { map, pluck } from 'rxjs/operators';
import { TaskMap } from '../models/task-map';
import { Store } from '@ngrx/store';
import { State } from '../store/state';
import { Observable } from 'rxjs';
import * as actions from '../store/actions/task-map';
import { TaskMapItem } from '../models/task-map-item';
import { TaskMapState } from '../store/state/task-map';

const KEY_TASK_MAP = 'task-map';

@Injectable({
  providedIn: 'root'
})
export class TaskMapService {
  public taskMap$: Observable<TaskMap>;
  public taskMapList$: Observable<TaskMapItem[]>;

  constructor(
    private store: Store<State>
  ) {
    this.taskMapList$ = this.store.pipe(
      pluck('taskMap', 'list')
    );
    this.taskMap$ = this.taskMapList$.pipe(
      map(this.fromArrayToMap)
    );
  }

  addItem(): void {
    this.store.dispatch(new actions.Add({
      key: null,
      value: null
    }));
  }

  deleteItem(index: number): void {
    this.store.dispatch(new actions.Delete(index));
  }

  updateItem(item: TaskMapItem, index: number): void {
    this.store.dispatch(new actions.Update({
      index,
      item
    }));
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
    } catch (e) {
    }

    return {
      list: []
    };
  }

  private static loadOldTaskMap(): TaskMapState | null {
    let data;
    try {
      data = JSON.parse(localStorage.getItem('jira-integration-task-map'));
    } catch (e) {
    }

    if (!data) {
      return null;
    }

    delete localStorage['jira-integration-task-map'];

    return {
      list: this.fromMapToArray(data)
    };
  }

  private static fromMapToArray(obj: TaskMap): TaskMapItem[] {
    return Object.keys(obj).map(key => ({ key, value: obj[key] }));
  }
}
