import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideTranslation } from '../../libs/translate';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  providers: [provideTranslation('skills', () => require.context('./translation'))],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent {
}
