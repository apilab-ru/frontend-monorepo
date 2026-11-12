import { DestroyRef, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GroupConfig, ImportLog, Log, LogDetail, Rule } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class AnalyzerService {
  private worker = new Worker(new URL('./analyzer.worker', import.meta.url));
  private nextRequestId = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.worker.terminate());
  }

  convertLogs(list: ImportLog[]): Log[] {
    if (!Array.isArray(list)) {
      throw new Error('Worklogs must be an array of [issue, comment, hours] rows.');
    }

    return list.map((row) => {
      const time = Math.round(parseFloat(row?.[2]) * 60);

      if (typeof row?.[0] !== 'string' || typeof row?.[1] !== 'string' || !Number.isFinite(time)) {
        throw new Error('Each worklog needs an issue, comment, and numeric hours.');
      }

      return { issue: row[0], comment: row[1], time };
    });
  }

  groupLogs(list: Log[], rules: Rule[], groupConfig: GroupConfig): Observable<LogDetail[]> {
    return new Observable((subscriber) => {
      const id = this.nextRequestId++;
      let completed = false;

      const onMessage = ({ data }: MessageEvent<{ id: number; logs: LogDetail[] }>) => {
        if (data.id !== id) {
          return;
        }

        completed = true;
        subscriber.next(data.logs);
        subscriber.complete();
      };
      const onError = (error: ErrorEvent) => subscriber.error(new Error(error.message));

      this.worker.addEventListener('message', onMessage);
      this.worker.addEventListener('error', onError);
      this.worker.postMessage({ id, list, rules, groupConfig });

      return () => {
        this.worker.removeEventListener('message', onMessage);
        this.worker.removeEventListener('error', onError);

        if (!completed) {
          this.worker.postMessage({ id, cancel: true });
        }
      };
    });
  }

  parserRules(rawRules: string[]): Rule[] {
    return rawRules.flatMap((line) => {
      const [action, condition, name] = line.split('|');
      const separator = condition?.indexOf(':') ?? -1;
      const field = condition?.slice(0, separator);
      const value = condition?.slice(separator + 1);

      if (action !== 'includes' || (field !== 'issue' && field !== 'comment') || !value) {
        return [];
      }

      return [{ action, field, values: value.split(','), key: value, name }];
    });
  }
}
