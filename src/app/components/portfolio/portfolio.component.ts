import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { PROJECTS_PREVIEW, ProjectType } from './const';
import { BehaviorSubject } from 'rxjs';
import { Project } from '../interfaces/project';
// @ts-ignore
import * as mixitup from 'mixitup/dist/mixitup.js';
import { Router } from '@angular/router';

interface Item<T> extends Element {
  data: T;
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  animations: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioComponent implements AfterViewInit {
  projectTypes = Object.values(ProjectType) as ProjectType[];
  filter$ = new BehaviorSubject<ProjectType | null>(ProjectType.frontend);
  projects = PROJECTS_PREVIEW;

  @ViewChild('box', { static: true }) box: ElementRef<HTMLElement>;

  constructor(
    private router: Router,
  ) {
  }

  ngAfterViewInit(): void {
    const mixer = mixitup(this.box.nativeElement, {
      selectors: {
        target: '.card',
      },
      animation: {
        duration: 300,
      },
    });

    // @ts-ignore
    const collection: Item<Project>[] = Array.from(
      this.box.nativeElement.querySelectorAll('.card'),
    ).map((item, index) => {
      // @ts-ignore
      item['data'] = this.projects[index];
      return item;
    });

    this.filter$.subscribe(filter => {
      const filteredList = collection.filter(item => {
        return !filter || item.data.types.includes(filter);
      });

      mixer.filter(filteredList);
    });
  }

  openDialog(project: Project): void {
    this.router.navigate([], {
      queryParams: { project: project.id },
      queryParamsHandling: 'merge',
      preserveFragment: true,
    });
  }

  setFilter(value: ProjectType | null): void {
    this.filter$.next(value);
  }

  trackById(index: number, project: Project): string {
    return project.id;
  }
}
