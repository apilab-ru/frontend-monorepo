import { Injectable } from "@angular/core";
import { ProviderAbstract } from "./povider-abstract";
import { IntegrationJira, JiraItem } from "../interfase";
import { concat, Observable, of, switchMap, throwError, toArray } from "rxjs";
import { Calc } from "../../board/models/calc";
import { HttpClient } from "@angular/common/http";
import { TimeService } from "../../board/services/time.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import format from 'date-fns/format'
import { map } from "rxjs/operators";

interface Cred {
  token: string;
  domain: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProviderJira implements ProviderAbstract<IntegrationJira> {
  private cred: Cred;
  private api = '/rest/api/2/';

  constructor(
    private http: HttpClient,
    private timeService: TimeService,
    private fb: FormBuilder,
  ) {
  }

  init(integration: IntegrationJira): Observable<boolean> {
    this.cred = {
      token: integration.token,
      domain: integration.domain,
    }

    return this.checkAccess(this.cred);
  }

  buildForm(): FormGroup {
    return this.fb.group({
      domain: '',
      token: ''
    });
  }

  validate(form: Cred): Observable<boolean> {
    if (!form.domain) {
      return throwError(() => new Error('Fill domain'))
    }

    if (!form.token) {
      return throwError(() => new Error('Fill token'))
    }

    return this.checkAccess(form);
  }

  export(calc: Calc[], date: string): Observable<boolean> {

    const list: (JiraItem & { task: string })[] = [];

    const clearDate = new Date(date);
    const timeZone = format(clearDate, 'xx');

    const formatMinutes = (minutes: number) => date + 'T' + this.timeService.getStringHourMinute(minutes) + ':00.000' + timeZone;

    calc.forEach(item => {
      list.push({
        task: item.task,
        comment: item.description,
        timeSpentSeconds: item.time,
        started: formatMinutes(item.timeStart),
      })
    })

    return concat(
      ...list.map(({ task, ...item }) => this.addWorkLog(task, item))
    ).pipe(
      toArray(),
      map(() => true),
    );
  }

  private addWorkLog(issue: string, item: JiraItem): Observable<void> {
    const api = 'https://' + this.cred.domain + this.api + `issue/${issue}/worklog`;

    return this.http.post<void>(api, {
      ...item,
    },{
      headers: {
        'Authorization': 'Bearer ' + this.cred.token,
      },
      withCredentials: true,
    });
  }

  private checkAccess(cred: Cred): Observable<boolean> {
    const api = 'https://' + cred.domain + this.api + 'myself';

    return this.http.get(api, {
      headers: {
        'Authorization': 'Bearer ' + cred.token
      }
    }).pipe(
      switchMap(data => {
        if (data) {
          return of(true);
        }

        return throwError(() => new Error('Error Access'))
      })
    )
  }
}