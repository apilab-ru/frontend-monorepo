import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { registerTranslationManually } from '../libs/translate';
import { Observable } from 'rxjs';
import { Project } from '../components/interfaces/project';
import { map, take } from 'rxjs/operators';
import { PROJECTS } from './portfolio';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  projects$: Observable<Project[]>;

  constructor(
    private translocoService: TranslocoService,
  ) {
    registerTranslationManually(
      'portfolio',
      () => require.context('./translation'),
      this.translocoService,
    );

    this.projects$ = this.translocoService.selectTranslateObject('portfolio.list').pipe(
      map((allData) => {
        return PROJECTS.map(item => {
          const data = allData[item.id!];

          return {
            ...item,
            ...(data ? data : {})
          };
        });
      })
    )
  }

  loadProject(projectId: string): Observable<Project> {
    return this.projects$.pipe(
      take(1),
      map(list => list.find(it => it.id === projectId)!),
    )
  }
}
