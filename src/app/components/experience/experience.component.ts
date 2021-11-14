import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WORKS } from './const';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceComponent  {
  works = WORKS;
  experience = this.getYearExperience();

  private getYearExperience(): number {
    return new Date().getFullYear() - 2013
  }
}
