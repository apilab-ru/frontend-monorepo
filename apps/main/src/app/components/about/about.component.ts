import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideTranslation } from '../../libs/translate';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  // @ts-ignore
  providers: [provideTranslation('about', () => import.meta.webpackContext('./translation'))],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
}
