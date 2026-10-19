import translations from './translation';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideTranslation } from '@shared/translations';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [provideTranslation('header', translations)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class HeaderComponent {
  lang$: Observable<string>;
  langs = [
    { key: 'ru', title: 'Русская версия' },
    { key: 'en', title: 'English version' },
  ];

  constructor(private router: Router, private translocoService: TranslocoService) {
    this.lang$ = this.translocoService.langChanges$;
  }

  setLang(lang: string): void {
    this.router.navigate(['/', lang]);
  }
}
