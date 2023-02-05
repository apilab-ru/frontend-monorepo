import { Injectable } from '@angular/core';
import { HistoryEvent } from '../models/history-event';
import { State } from '../store/state';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

const KEY_STORE = 'time-history';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private stateLog: HistoryEvent<State>[] = [];
  private readonly minStateLength = 2;
  private readonly maxSaveStoreSteps = 10;

  constructor() {
    this.stateLog = this.loadStore();
  }

  addState(state: State): void {
    if (isEqual(state, this.getLastState())) {
      return;
    }

    const date = new Date();
    this.stateLog.push({
      dateTime: date.toLocaleDateString() + ` ${date.getHours()}:${date.getMinutes()}`,
      data: cloneDeep(state)
    });

    this.saveStore();
  }

  prevent(): State {
    if (this.stateLog.length >= this.minStateLength) {
      this.stateLog.pop();
      return this.stateLog.pop().data;
    } else {
      return null;
    }
  }

  private getLastState(): State | null {
    const lastIndex = this.stateLog.length - 1;
    if (lastIndex < 0) {
      return null;
    }

    return this.stateLog[lastIndex].data;
  }

  private saveStore(): void {
    const events = cloneDeep(this.stateLog)
      .reverse()
      .slice(0, this.maxSaveStoreSteps)
      .reverse();

    localStorage.setItem(KEY_STORE, JSON.stringify(events));
  }

  private loadStore(): HistoryEvent<State>[] {
    const dataInline = localStorage.getItem(KEY_STORE);

    if (!dataInline) {
      return [];
    }

    try {
      return JSON.parse(dataInline);
    } catch (e) {
      return [];
    }
  }
}
