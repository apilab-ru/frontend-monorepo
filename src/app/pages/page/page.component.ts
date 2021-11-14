import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ScrollNavigationService } from '../../services/scroll-navigation.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';
import { ModalProjectComponent } from '../../components/modal-project/modal-project.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent implements AfterViewInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private scrollNavigationService: ScrollNavigationService,
    private dialog: MatDialog,
    private router: Router,
  ) {
  }

  private openProject(project: string): Observable<void> {
    return this.dialog.open(ModalProjectComponent, {
      data: project
    }).afterClosed();
  }

  ngAfterViewInit(): void {
    this.scrollNavigationService.initListener();

    this.activatedRoute.queryParams.pipe(
      map(({ project }) => project),
      filter(project => !!project),
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
