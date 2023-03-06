import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideTranslation } from '../../libs/translate';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  // @ts-ignore
  providers: [provideTranslation('header', () => import.meta.webpackContext('./translation'))],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  lang$: Observable<string>;
  langs = [{ key: 'ru', title: 'Русская версия' }, { key: 'en', title: 'English version' }];

  constructor(
    private router: Router,
    private translocoService: TranslocoService,
  ) {
    this.lang$ = this.translocoService.langChanges$;
  }

  setLang(lang: string): void {
    this.router.navigate(['/', lang]);
  }
}
