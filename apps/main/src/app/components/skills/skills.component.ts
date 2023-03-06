import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideTranslation } from '../../libs/translate';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  // @ts-ignore
  providers: [provideTranslation('skills', () => import.meta.webpackContext('./translation'))],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent {
}
