import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TaskStatus } from "../../models/const";
import { TaskDetail } from "../../models/interface";
import { makeStore } from "@store";

@Injectable()
export class TaskDetailService {
  private store = makeStore({
    task: undefined as undefined | TaskDetail,
  })

  constructor(
    private fb: FormBuilder,
  ) {
  }

  setTask(task: TaskDetail): void {
    this.store.task.next(task);
  }

  buildForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      tags: this.fb.array([]),
      link: '',
      status: TaskStatus.open,
      description: '',
      marks: this.fb.array([]),
    })
  }
}
