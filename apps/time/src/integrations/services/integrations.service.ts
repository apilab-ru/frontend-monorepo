import { Injectable } from '@angular/core';
import { Integration } from "../interfase";
import { BehaviorSubject } from "rxjs";

const STORE_KEY = 'timeIntegrations';

@Injectable({
  providedIn: 'root'
})
export class IntegrationsService {
  private integrations = new BehaviorSubject<Integration[]>([]);

  integrations$ = this.integrations.asObservable();

  constructor() {
    const lastData = localStorage.getItem(STORE_KEY);
    const integrations = lastData ? JSON.parse(lastData) : [];
    this.integrations.next(integrations);
  }

  addIntegrations(integration: Integration): void {
    const list = this.integrations.getValue();
    list.push(integration);
    this.updateList(list);
  }

  removeIntegrations(index: number): void {
    const list = this.integrations.getValue();
    list.splice(index, 1);
    this.updateList(list);
  }

  private updateList(list: Integration[]): void {
    this.integrations.next(list);
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
  }
}
