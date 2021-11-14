import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { PROJECTS_PREVIEW, ProjectType } from './const';
import { BehaviorSubject } from 'rxjs';
import { Project } from '../interfaces/project';
// @ts-ignore
import * as mixitup from 'mixitup/dist/mixitup.js';

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

  setFilter(value: ProjectType | null): void {
    this.filter$.next(value);
  }

  trackById(index: number, project: Project): number {
    return project.id;
  }
}
