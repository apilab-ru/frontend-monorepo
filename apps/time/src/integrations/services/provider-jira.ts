import { Injectable } from "@angular/core";
import { ProviderAbstract } from "./povider-abstract";
import { IntegrationJira, JiraItem } from "../interfase";
import { Observable, of, throwError } from "rxjs";
import { Calc } from "../../board/models/calc";
import { TimeService } from "../../board/services/time.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Clipboard } from '@angular/cdk/clipboard';
import format from 'date-fns/format'
import { MatSnackBar } from "@angular/material/snack-bar";
import { jiraFetch } from './fetch.js';
import { map } from "rxjs/operators";

interface Cred {
  domain: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProviderJira implements ProviderAbstract<IntegrationJira> {
  private domain: string;

  constructor(
    private timeService: TimeService,
    private fb: FormBuilder,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
  ) {
  }

  init(integration: IntegrationJira): Observable<boolean> {
    this.domain = integration.domain;

    return of(true);
  }

  buildForm(): FormGroup {
    return this.fb.group({
      domain: ''
    });
  }

  validate(form: Cred): Observable<boolean> {
    if (!form.domain) {
      return throwError(() => new Error('Domain is required'))
    }

    return of(true);
  }

  export(calc: Calc[], date: string): Observable<boolean> {
    const list: (JiraItem & { task: string })[] = [];

    const clearDate = new Date(date);
    const timeZone = format(clearDate, 'xx');

    const formatMinutes = (minutes: number) => date + 'T' + this.timeService.getStringHourMinute(minutes) + ':00.000' + timeZone;

    calc.forEach(item => {
      list.push({
        task: item.task.trim(),
        comment: item.description.trim(),
        timeSpentSeconds: item.time * 60,
        started: formatMinutes(item.timeStart),
      })
    });

    const code = this.prepareCode(list);

    console.log('code', code);
    this.clipboard.copy(code);

    return this.snackBar.open('Code copied! Past in console on jira Page.', 'OpenPage', {
      duration: 30_000
    }).onAction().pipe(
      map(() => {
        const url = `https://${ this.domain }/secure/WorklogsAction!show.jspa`;
        window.open(url,'_blank');

        return true;
      }),
    );
  }

  private prepareCode(list: (JiraItem & { task: string })[] ) {
    return `
    (function() {
      const list = ${ JSON.stringify(list) };
      const domain = location.host;

      ${ jiraFetch.toString() };

      ${ jiraFetch.name }(list, domain);
  })();`
  }
}