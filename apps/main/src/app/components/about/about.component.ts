import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideTranslation } from '@shared/translations';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  providers: [provideTranslation('about', () => import.meta.webpackContext('./translation'))],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  email = 'viktor@apilab.ru';
}
