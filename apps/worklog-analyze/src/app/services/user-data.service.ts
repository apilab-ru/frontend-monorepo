import { effect, Injectable, signal } from '@angular/core';
import { DEFAULT_DATA } from '../const';
import { LogsUserRawData } from '../interfaces';

const STORAGE_KEY = 'workLogAnalyzeForm-v2';

@Injectable({ providedIn: 'root' })
export class UserDataService {
  data = signal<LogsUserRawData>(this.loadData());

  constructor() {
    effect(() => {
      const data = this.data();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        // Analysis still works when browser storage is unavailable.
      }
    });
  }

  private loadData(): LogsUserRawData {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');

      if (saved && typeof saved.logs === 'string' && typeof saved.rules === 'string' &&
          ['groupByTask', 'groupByComment', 'groupByRules'].every(
            (key) => typeof saved.groupConfig?.[key] === 'boolean')) {
        return saved;
      }
    } catch {
      // Ignore invalid or unavailable browser storage.
    }

    return DEFAULT_DATA;
  }
}
