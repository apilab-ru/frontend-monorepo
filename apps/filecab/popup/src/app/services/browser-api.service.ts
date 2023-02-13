import { Injectable } from '@angular/core';
import { Tab } from '../interface';

@Injectable({
  providedIn: 'root',
})
export class BrowserApiService {
  getActiveTab(): Promise<Tab> {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tab = tabs[0];

        if (!tab.url || tab.url.indexOf('chrome://') === 0) {
          reject('notSupportTab');
        } else {
          resolve(tabs[0]);
        }
      });
    });
  }

  getTabLinks(tab: Tab): { url: string, domain: string } {
    return {
      url: tab.url,
      domain: this.getTabDomain(tab),
    };
  }

  getActiveTabLinks(): Promise<{ url: string, domain: string }> {
    return this.getActiveTab().then(tab => this.getTabLinks(tab));
  }

  executeScriptOnTab<R>(tabId: number, func: () => R, args: unknown[] = []): Promise<R> {
    return chrome.scripting.executeScript({
      target: { tabId },
      func,
      args: (args || []) as [],
    }).then(([res]) => res.result as R);
  }

  private getTabDomain(tab: chrome.tabs.Tab): string {
    return tab.url.split('/')[2].replace('www.', '');
  }
}
