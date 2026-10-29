import { Injectable, DOCUMENT, inject } from '@angular/core';

import { fromEvent, Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class KeyListenerService {
  private document = inject<Document>(DOCUMENT);

  private pressedButtons: string[] = [];
  private pressed$ = new Subject<string[]>();

  constructor() {
    fromEvent<KeyboardEvent>(this.document, 'keydown')
      .pipe(takeUntilDestroyed())
      .subscribe((e: KeyboardEvent) => {
        const key = this.getCode(e);
        const index = this.pressedButtons.indexOf(key);

        if (index === -1) {
          this.pressedButtons.push(key);
        }

        this.handleClick();
      });

    fromEvent<KeyboardEvent>(this.document, 'keyup')
      .pipe(takeUntilDestroyed())
      .subscribe((e: KeyboardEvent) => {
        const key = this.getCode(e);
        const index = this.pressedButtons.indexOf(key);

        if (index !== -1) {
          this.pressedButtons.splice(index, 1);
        }
      });
  }

  listener(keys: string[]): Observable<string[]> {
    return this.pressed$.pipe(filter((list) => this.checkInList(list, keys)));
  }

  private getCode(e: KeyboardEvent): string {
    return e.code;
  }

  private handleClick(): void {
    this.pressed$.next(this.pressedButtons);
  }

  private checkInList(list: string[], keys: string[]): boolean {
    const hash = list.reduce(function (acc, i) {
      acc[i] = true;

      return acc;
    }, {});

    return keys.every(function (i) {
      return i in hash;
    });
  }
}
