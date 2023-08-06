import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BrowserApiService {
  getActiveTab(): Promise<chrome.tabs.Tab> {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        resolve(tabs[0]);
      });
    });
  }

  executeScriptOnTab<R>(tabId: number, func: () => R, args: unknown[] = []): Promise<R> {
    return chrome.scripting.executeScript({
      target: { tabId },
      func,
      args: (args || []) as [],
    }).then(([res]) => res.result as R);
  }
}
