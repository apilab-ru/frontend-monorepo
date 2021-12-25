import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe as CommonDatePipe } from '@angular/common';
import { TranslocoService } from '@ngneat/transloco';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

const LANG_MAP = {
  'ru': 'ru-RU',
  'en': 'en-US',
};

@Pipe({
  name: 'appDate'
})
export class AppDatePipe implements PipeTransform {
  lang$ = this.translocoService.langChanges$.pipe(
    // @ts-ignore
    map(lang => LANG_MAP[lang]),
  );

  constructor(
    private datePipe: CommonDatePipe,
    private translocoService: TranslocoService,
  ) {
  }

  transform(date: string | Date, format: string = 'LLLL, YYYY'): Observable<string | null> {
    return this.lang$.pipe(
      map(lang => this.datePipe.transform(date, format, undefined, lang))
    );
  }

}
