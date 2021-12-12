import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WORKS } from '../../experience';
import differenceInYears from 'date-fns/differenceInYears';
import { ScrollNavigationService } from '../../services/scroll-navigation.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceComponent  {
  works = WORKS;
  experience = this.getYearExperience();

  constructor(
    private scrollNavigationService: ScrollNavigationService,
  ) {
  }

  scrollToPortfolio(): void {
    this.scrollNavigationService.scrollTo('portfolio');
  }

  private getYearExperience(): number {
    return differenceInYears(
      new Date(),
      new Date('2013-12-01'),
    );
  }
}
