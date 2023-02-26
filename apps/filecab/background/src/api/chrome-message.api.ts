import { Environment } from "../../../environments";
import { WorkerEvent } from "../interface";

export abstract class ChromeMessage {
  abstract startWorker(handler: (event: WorkerEvent) => void): void;

  abstract connectToWorker(handler: (event: WorkerEvent) => void): void;

  abstract postMessage(data: WorkerEvent): void;
}

class ChromeMessageApi implements ChromeMessage {
  startWorker(handler: (event: WorkerEvent) => void): void {
    chrome.runtime.onMessage.addListener((message) => handler(message))
  }

  connectToWorker(handler: (event: WorkerEvent) => void): void {
    chrome.runtime.onMessage.addListener((event: WorkerEvent) => handler(event));
  }

  postMessage(data: WorkerEvent): void {
    chrome.runtime.sendMessage(data).catch(error => {
      console.log('error send message', error, data)
    });
  }
}

class ChromeMessageMockApi implements ChromeMessage {
  private worker: SharedWorker;
  private ports: MessagePort[] = [];
  private isClient = false;

  constructor(backgroundUrl: string) {
    this.worker = new SharedWorker(backgroundUrl);
  }

  startWorker(handler: (event: WorkerEvent) => void) {
    self.addEventListener('connect', (event) => {
      const [port] = (event as MessageEvent).ports;

      this.ports.push(port);

      port.onmessage = ({ data }) => handler(data);

      port.start();
    });
  }

  connectToWorker(handler: (event: WorkerEvent) => void) {
    this.isClient = true;

    this.worker.port.start();

    this.worker.port.onmessage = ({ data }: MessageEvent) => handler(data);
  }

  postMessage(data: WorkerEvent): void {
    if (this.isClient) {
      return this.worker.port.postMessage(data)
    }

    this.ports.forEach(port => {
      port.postMessage(data)
    })
  }
}

export function makeChromeApi(environment: Environment): ChromeMessage {
  if (environment.useBrowser) {
    return new ChromeMessageMockApi(environment.backgroundUrl);
  }

  return new ChromeMessageApi();
}

