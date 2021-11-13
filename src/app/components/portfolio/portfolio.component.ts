import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { PROJECTS_PREVIEW, ProjectType } from './const';
import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';
import { Project } from '../interfaces/project';
import { map } from 'rxjs/operators';
import { ANIMATION } from './animation';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  animations: [ANIMATION],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioComponent implements OnInit {
  projectTypes = Object.values(ProjectType) as ProjectType[];

  filter$ = new BehaviorSubject<ProjectType | null>(null);
  projects$: Observable<Project[]>;

  ngOnInit(): void {
    this.projects$ = this.filter$.pipe(map(filter => PROJECTS_PREVIEW
      .filter(item => filter ? item?.types.includes(filter) : true )));
  }

  setFilter(value: ProjectType | null) {
    this.filter$.next(value);
  }

  trackById(index: number, project: Project): number {
    return project.id;
  }
}
