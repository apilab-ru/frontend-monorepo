import translations from './translation';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideTranslation } from '@shared/translations';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  providers: [provideTranslation('about', translations)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AboutComponent {
  email = 'viktor@apilab.ru';
}
