import { TaskMapItem } from '../../models/task-map-item';

export const TASK_MAP_STATE = {
  list: [] as TaskMapItem[],
};

export type TaskMapState = typeof TASK_MAP_STATE;
