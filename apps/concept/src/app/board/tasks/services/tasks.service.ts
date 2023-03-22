import { Injectable } from '@angular/core';
import { finalize, Observable, switchMap, tap } from "rxjs";
import { TaskApiService } from "./task-api.service";
import { Task, TaskDetail, TaskDetailRequest, TasksQuery } from "../models/interface";
import { Response } from "../../../core/request";
import { makeStore } from "@store";

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private store = makeStore({
    refreshSign: undefined as void,
    loading: false,
  });

  loading$ = this.store.loading.asObservable();

  constructor(
    private taskApiService: TaskApiService,
  ) {
  }

  loadList(query: TasksQuery): Observable<Response<Task>> {
    return this.store.refreshSign.pipe(
      tap(() => this.store.loading.next(true)),
      switchMap(() => this.taskApiService.loadList(query)),
      tap(() => this.store.loading.next(false)),
      finalize(() => this.store.loading.next(false)),
    );
  }

  createTask(task: TaskDetailRequest): Observable<TaskDetail> {
    return this.taskApiService.createTask(task).pipe(
      tap(() => this.store.refreshSign.next())
    );
  }
}
