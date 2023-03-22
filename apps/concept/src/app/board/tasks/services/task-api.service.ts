import { Injectable } from '@angular/core';
import { Task, TaskDetail, TaskDetailRequest, TasksQuery } from "../models/interface";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Response } from "../../../core/request";

@Injectable({
  providedIn: 'root'
})
export class TaskApiService {
  private endpoint = '/tasks/';

  constructor(
    private httpClient: HttpClient,
  ) { }

  createTask(task: TaskDetailRequest): Observable<TaskDetail> {
    return this.httpClient.post<TaskDetail>(this.endpoint + 'create', task, {
      withCredentials: true,
    })
  }

  loadTask(id: string): Observable<TaskDetail> {
    return this.httpClient.get<TaskDetail>(this.endpoint + id, {
      withCredentials: true,
    })
  }

  loadList(query: TasksQuery): Observable<Response<Task>> {
    return this.httpClient.get<Response<Task>>(this.endpoint + 'list', {
      params: {
        ...query
      },
      withCredentials: true,
    });
  }
}
