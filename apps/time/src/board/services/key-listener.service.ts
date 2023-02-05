import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class KeyListenerService {

  private pressedButtons: string[] = [];
  private pressed$ = new Subject<string[]>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) {
    fromEvent(this.document, 'keydown')
      .subscribe((e: KeyboardEvent) => {
        const key = this.getCode(e);
        const index = this.pressedButtons.indexOf(key);
        if (index === -1) {
          this.pressedButtons.push(key);
        }
        this.handleClick();
      });

    fromEvent(this.document, 'keyup')
      .subscribe((e: KeyboardEvent) => {
        const key = this.getCode(e);
        const index = this.pressedButtons.indexOf(key);
        if (index !== -1) {
          this.pressedButtons.splice(index, 1);
        }
      });
  }

  listener(keys: string[]): Observable<string[]> {
    return this.pressed$
      .pipe(
        filter(list => this.checkInList(list, keys)),
      );
  }

  private getCode(e: KeyboardEvent): string {
    return e.code;
  }

  private handleClick(): void {
    this.pressed$.next(this.pressedButtons);
  }

  private checkInList(list: string[], keys: string[]): boolean {
    const hash = list.reduce(function(acc, i) { acc[i] = true; return acc; }, {});
    return keys.every(function(i) { return i in hash; });
  }
}
