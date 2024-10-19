import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ScrollNavigationService } from '../../services/scroll-navigation.service';

import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter, map, startWith, switchMap } from 'rxjs/operators';
import { ModalProjectComponent } from '../../components/modal-project/modal-project.component';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { Title } from '@angular/platform-browser';
import { provideTranslation, registerTranslationManually } from '@shared/translations';
import { PortfolioService } from '../../portfolio/portfolio.service';
import { Project } from '../../components/interfaces/project';
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // @ts-ignore
  providers: [provideTranslation('page', () => import.meta.webpackContext('./translation'))],
})
export class PageComponent implements AfterViewInit, OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private scrollNavigationService: ScrollNavigationService,
    private dialog: MatDialog,
    private router: Router,
    private translocoService: TranslocoService,
    private title: Title,
    private portfolioService: PortfolioService,
  ) {
  }

  ngOnInit(): void {
    // @ts-ignore
    registerTranslationManually('page', () => import.meta.webpackContext('./translation'), this.translocoService);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(undefined),
      map(() => this.activatedRoute.snapshot.data?.lang),
      distinctUntilChanged(),
    ).subscribe(lang => {
      this.translocoService.setActiveLang(lang);
    });

    this.translocoService
      .selectTranslate('page.title')
      .subscribe(title => this.title.setTitle(title));
  }

  private openProject(project: Project): Observable<void> {
    return this.dialog.open(ModalProjectComponent, {
      data: project
    }).afterClosed();
  }

  ngAfterViewInit(): void {
    this.scrollNavigationService.initListener();

    this.activatedRoute.queryParams.pipe(
      map(({ project }) => project),
      filter(project => !!project),
      switchMap(projectId => this.portfolioService.loadProject(projectId)),
      switchMap(project => this.openProject(project))
    ).subscribe(() => {
      this.router.navigate([], {
        preserveFragment: true,
        queryParams: { project: null },
        queryParamsHandling: 'merge'
      });
    })
  }
}
