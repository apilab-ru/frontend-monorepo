import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, shareReplay, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ScrollNavigationService {
  sectionId$ = new BehaviorSubject<string>('');
  isScrolled$ = new BehaviorSubject<boolean>(false);

  private sections: HTMLElement[];
  private lastBreakpoint: number;
  private scrollTop$: Observable<number>;
  private headerHeight = 70;
  private isMobile = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  initListener(): void {
    this.isMobile = screen.availWidth < 721;
    this.headerHeight = this.isMobile ? 0 : 70;

    this.sections = Array.from(document.querySelectorAll('.section'));
    const element = document.querySelector('html')!;

    this.lastBreakpoint = document.body.scrollHeight - screen.availHeight - 250;

    this.scrollTop$ = fromEvent(document, 'scroll').pipe(
      startWith(undefined),
      map(() => element.scrollTop),
      debounceTime(100),
      shareReplay({ refCount: true, bufferSize: 1 }),
    );

    const skipDetectOnProjectPopupOpened = () => {
      return !this.activatedRoute.snapshot.queryParams.project;
    }

    this.scrollTop$.pipe(
      filter(skipDetectOnProjectPopupOpened),
      map(scrollTop => this.getActiveSection(scrollTop)),
      distinctUntilChanged(),
    ).subscribe(sectionId => {
      this.sectionId$.next(sectionId);

      this.router.navigate([], {
        fragment: sectionId,
        queryParamsHandling: 'merge'
      });
    });

    this.scrollTop$.subscribe(scrollTop => {
      this.isScrolled$.next(scrollTop > 0);
    });
  }

  scrollTo(sectionId: string): void {
    document.querySelector('#' + sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: this.isMobile ? 'start' : 'center',
    });
  }

  private getActiveSection(scrollTop: number): string {
    const scrollHeight = scrollTop + this.headerHeight;
    let diff: number = 0;
    let selectedId: string = '';

    if (this.lastBreakpoint < scrollHeight) {
      selectedId = this.sections[this.sections.length - 1].id;
    } else {
      this.sections.forEach((section) => {
        const localDiff = Math.abs(section.offsetTop - scrollHeight);
        if (!selectedId || localDiff < diff) {
          diff = localDiff;
          selectedId = section.id;
        }
      });
    }

    return selectedId;
  }
}
