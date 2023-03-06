import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideTranslation } from '../../libs/translate';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // @ts-ignore
  providers: [provideTranslation('footer', () => import.meta.webpackContext('./translation'))],
})
export class FooterComponent {
  year = new Date();
}
