import { Mark } from "../../marks/models/interface";
import { CreateRequest, RequestQuery } from "../../../core/request";
import { TaskStatus } from "./const";

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