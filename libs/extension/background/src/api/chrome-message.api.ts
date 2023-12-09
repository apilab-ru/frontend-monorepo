import { WorkerEvent } from "../interface";

export class ChromeMessageApi {
  startWorker(handler: (event: WorkerEvent, tabId?: number) => void): void {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      handler(message, sender?.tab?.id)

      sendResponse({ status: true });
    })
  }

  connectToWorker = this.startWorker;

  postMessage(data: WorkerEvent, tabId?: number): Promise<void> {
    if (tabId) {
      return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, data, () => {
          resolve()
        })
      });
    }

    return chrome.runtime.sendMessage(data);
  }
}
