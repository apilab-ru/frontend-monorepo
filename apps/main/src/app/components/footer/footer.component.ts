import translations from './translation';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideTranslation } from '@shared/translations';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideTranslation('footer', translations)],
  standalone: false,
})
export class FooterComponent {
  year = new Date();
}
