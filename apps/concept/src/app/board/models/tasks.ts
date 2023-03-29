import { Mark } from "./marks";
import { CreateRequest, RequestQuery } from "../../core/request";

export enum TaskStatus {
  open = 'open',
  progress = 'progress',
  close = 'close',
}

export interface Task {
  id: string;
  title: string;
  tags: string[];
  link: string;
  status: TaskStatus;
}

export interface TaskDetail extends Task {
  description: string;
  marks: Mark[];
}

export type TaskDetailRequest = CreateRequest<TaskDetail>;

export interface TasksQuery extends RequestQuery {
  search?: string;
  status?: TaskStatus;
}