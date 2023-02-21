import { ProviderAbstract } from "./povider-abstract";
import { Observable, switchMap, combineLatest, tap, concat, catchError, throwError, of, toArray } from "rxjs";
import { ClockifyItem, IntegrationClockify } from "../interfase";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Calc } from "../../board/models/calc";
import { TimeService } from "../../board/services/time.service";
import { FormBuilder, FormGroup } from "@angular/forms";

interface Entity {
  id: string;
}

interface Project {
  id: string;
  workspaceId: string;
  name: string;
}

interface Task {
  id: string;
  name: string;
  projectId: string;
  workspaceId: string;
}

interface Form {
  apiKey: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProviderClockify implements ProviderAbstract<IntegrationClockify> {
  private apiKey: string;
  private endpoint = 'https://api.clockify.me/api/v1';

  private projects: Project[];
  private tasks: Task[];

  constructor(
    private http: HttpClient,
    private timeService: TimeService,
    private fb: FormBuilder,
  ) {
  }

  buildForm(): FormGroup {
    return this.fb.group({
      apiKey: ''
    });
  }

  init(integration: IntegrationClockify): Observable<boolean> {
    this.apiKey = integration.apiKey;

    return this.prepareData();
  }

  validate(form: Form): Observable<boolean> {
    if (!form.apiKey) {
      return throwError(() => new Error('Fill ApiKey'))
    }

    return of(true);
  }

  fetch<T>(url: string): Observable<T> {
    return this.http.get<T>(this.endpoint + url, {
      headers: {
        'X-Api-Key': this.apiKey,
      }
    })
  }

  post<T, D>(url: string, body: D): Observable<T> {
    return this.http.post<T>(this.endpoint + url, body, {
      headers: {
        'X-Api-Key': this.apiKey,
      },
    })
  }

  export(calc: Calc[], date: string): Observable<boolean> {
    let converted: Record<string, ClockifyItem[]>;

    try {
      converted = this.mapSlots(calc, date);
    } catch (error) {
      return throwError(() => error)
    }

    const workspaces$ = Object.entries(converted).map(([workspaceId, list ]) => {
      return concat(
        ...list.map(item => this.post(`/workspaces/${workspaceId}/time-entries`, item))
      )
    });

    return combineLatest(
      ...workspaces$,
    ).pipe(
      toArray(),
      map(() => true),
      catchError(error => {
        const message = error?.error?.message || error;

        return throwError(() => new Error(message));
      }),
    );
  }

  private mapSlots(calc: Calc[], date: string): Record<string, ClockifyItem[]> | never {
    const record:Record<string, ClockifyItem[]> = {};

    const formatMinutes = (minutes: number) => {
      const localDate = new Date(date + 'T' + this.timeService.getStringHourMinute(minutes) + ':00Z');
      const utcHours = localDate.getUTCHours();
      return new Date(localDate.setHours(utcHours)).toISOString()
    };

    calc.forEach(item => {

      const task = this.tasks.find(task => task.name === item.task);
      const project = this.projects.find(project => project.name === item.task);

      const taskId = task?.id || '';
      const projectId = task?.projectId || project?.id || '';
      const workspaceId = task?.workspaceId || project?.workspaceId;

      if (!workspaceId) {
        throw new Error(`Cant math task ${item.task}`);
      }

      if (!record[workspaceId]) {
        record[workspaceId] = [];
      }

      record[workspaceId].push({
        start: formatMinutes(item.timeStart),
        billable: "false",
        description: item.description,
        projectId,
        taskId,
        end: formatMinutes(item.timeStart + item.time),
        tagIds: [],
        customFields: [],
      })

    })

    return record;
  }

  private prepareData(): Observable<boolean> {
    const workspaces$ = this.fetch<Entity[]>('/workspaces');

    return workspaces$.pipe(
      map(list => list.map(item => item.id)),
      switchMap(list => combineLatest(
        ...list.map(id => this.loadProjects(id))
      )),
      map(list => list.flat()),
      tap(projects => {
        this.projects = projects;
      }),
      switchMap(projects => combineLatest(
        ...projects.map(({ id, workspaceId }) => this.fetch<Task[]>(`/workspaces/${workspaceId}/projects/${id}/tasks`))
      )),
      map(list => list.flat()),
      tap(tasks => {
        this.tasks = tasks.map(item => ({
          id: item.id,
          name: item.name,
          projectId: item.projectId,
          workspaceId: this.projects.find(it => it.id === item.projectId)?.workspaceId || '',
        }))
      }),
      map(() => true),
    )
  }

  private loadProjects(id: string): Observable<Project[]> {
    return this.fetch<Project[]>(`/workspaces/${id}/projects`);
  }
}
