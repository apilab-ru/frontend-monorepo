import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { JOB_LIST, START_WORK_DATE } from './experience';
import differenceInYears from 'date-fns/differenceInYears';
import { ScrollNavigationService } from '../../services/scroll-navigation.service';
import { provideTranslation } from '../../libs/translate';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Work } from '../interfaces/work';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
  providers: [provideTranslation('experience', () => require.context('./translation'))],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceComponent implements OnInit  {
  works$: Observable<Work[]>;
  experience = this.getYearExperience();
  link$ = this.scrollNavigationService.getLink();

  constructor(
    private scrollNavigationService: ScrollNavigationService,
    private translocoService: TranslocoService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.works$ = this.translocoService.selectTranslateObject('experience.works').pipe(
      map(obj => {
        return JOB_LIST.map(({key, ...item}) => ({
          ...item,
          ...obj[key]
        }));
      })
    );
  }

  scrollToPortfolio(link: string, type?: string): void {
    this.scrollNavigationService.scrollTo('portfolio');
    this.router.navigateByUrl(link + (!type ? '' : `?type=${type}`) + '#portfolio');
  }

  private getYearExperience(): number {
    return differenceInYears(
      new Date(),
      new Date(START_WORK_DATE),
    );
  }
}
