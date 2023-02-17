import { Injectable, NgZone } from '@angular/core';
import { Tab } from '../interface';
import { from, map, Observable } from 'rxjs';
import { runInZone } from '@angular-shared';

@Injectable({
  providedIn: 'root',
})
export class BrowserApiService {
  constructor(private ngZone: NgZone) {
  }

  getActiveTab(): Observable<Tab> {
    return new Observable<Tab>((subject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tab = tabs[0];

        if (!tab.url || tab.url.indexOf('chrome://') === 0) {
          subject.error('notSupportTab');
        } else {
          subject.next(tabs[0]);
        }
      });
    }).pipe(runInZone(this.ngZone));
  }

  getTabLinks(tab: Tab): { url: string, domain: string } {
    return {
      url: tab.url,
      domain: this.getTabDomain(tab),
    };
  }

  getActiveTabLinks(): Observable<{ url: string, domain: string }> {
    return this.getActiveTab().pipe(
      map(tab => this.getTabLinks(tab))
    );
  }

  executeScriptOnTab<R>(tabId: number, func: () => R, args: unknown[] = []): Observable<R> {
    return from(chrome.scripting.executeScript({
      target: { tabId },
      func,
      args: (args || []) as [],
    }).then(([res]) => res.result as R))
      .pipe(runInZone(this.ngZone));
  }

  private getTabDomain(tab: chrome.tabs.Tab): string {
    return tab.url.split('/')[2].replace('www.', '');
  }
}
