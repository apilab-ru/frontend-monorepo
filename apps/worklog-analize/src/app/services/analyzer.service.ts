import { Injectable } from '@angular/core';
import { GroupConfig, ImportLog, Log, LogDetail, Rule } from '../interfaces';
import { fromEvent, map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AnalyzerService {
  private worker: Worker;
  private logs$: Observable<LogDetail[]>;

  constructor() {
    this.worker = new Worker(new URL('./analyzer.worker', import.meta.url));

    this.logs$ = fromEvent<{data: LogDetail[]}>(this.worker, 'message').pipe(
      map(({ data }) => data)
    )
  }

  convertLogs(list: ImportLog[]): Log[] {
    if (!list) {
      return [];
    }

    return list.map((res) => ({
      issue: res[0],
      comment: res[1],
      time: Math.round(parseFloat(res[2]) * 60),
    }))
  }

  groupLogs(list: Log[], rules: Rule[], groupConfig: GroupConfig): Observable<LogDetail[]> {
    this.worker.postMessage({ list, rules, groupConfig });
    return this.logs$;
  }

  parserRules(rawRules: string[]): Rule[] {
    return rawRules.map(item => {
      const [action, other, name] = item.split('|');

      if (!other) {
        return null;
      }

      const [field, value] = other.split(':');
      const values = value?.split(',');

      if (!values) {
        return null;
      }

      return {
        action,
        field,
        values,
        key: value,
        name
      } as Rule
    }).filter(this.typeFilter)
  }

  private typeFilter(it: Rule | null): it is Rule {
    return !!it;
  }
}
