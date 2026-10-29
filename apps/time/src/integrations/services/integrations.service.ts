import { Injectable, signal } from '@angular/core';
import { Integration } from '../interface';

const STORE_KEY = 'timeIntegrations';

@Injectable({
  providedIn: 'root',
})
export class IntegrationsService {
  private state = signal<Integration[]>([]);
  integrations = this.state.asReadonly();

  constructor() {
    const lastData = localStorage.getItem(STORE_KEY);
    const integrations = lastData ? JSON.parse(lastData) : [];
    this.state.set(integrations);
  }

  addIntegrations(integration: Integration): void {
    this.updateList([...this.state(), integration]);
  }

  removeIntegrations(index: number): void {
    this.updateList(this.state().filter((_, i) => i !== index));
  }

  private updateList(list: Integration[]): void {
    this.state.set(list);
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
  }
}
