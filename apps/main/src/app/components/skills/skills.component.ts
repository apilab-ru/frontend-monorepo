import translations from './translation';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideTranslation } from '@shared/translations';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
  providers: [provideTranslation('skills', translations)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SkillsComponent {}
