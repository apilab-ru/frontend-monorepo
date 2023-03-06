import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideTranslation } from '../../libs/translate';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  providers: [provideTranslation('about', () => require.context('./translation'))],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
}
