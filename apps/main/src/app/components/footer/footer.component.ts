import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideTranslation } from '../../libs/translate';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideTranslation('footer', () => require.context('./translation'))],
})
export class FooterComponent {
  year = new Date();
}
