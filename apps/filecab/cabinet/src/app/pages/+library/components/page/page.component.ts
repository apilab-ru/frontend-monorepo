import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { combineLatest, map, Observable, shareReplay, switchMap } from "rxjs";
import { Types } from "@filecab/models/types";
import { LibraryItemV2 } from "@filecab/models/library";
import { FileCabService } from "@shared/services/file-cab.service";

@Component({
  selector: 'cabinet-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent implements OnInit {
  type$: Observable<Types>;
  list$: Observable<LibraryItemV2[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private filecabService: FileCabService,
  ) {
  }

  ngOnInit(): void {
    this.type$ = this.activatedRoute.data.pipe(
      map(data => data.type),
      shareReplay({ refCount: true, bufferSize: 1 }),
    );

    this.list$ = combineLatest([
      this.filecabService.data$,
      this.type$
    ]).pipe(
      map(([list, type]) => list.filter(item => item.type === type)),
      shareReplay({ refCount: true, bufferSize: 1 }),
    );

    this.list$.subscribe(list => console.log('xxx list', list))
  }

  trackById(_index: number, item: LibraryItemV2): number {
    return item.item.id;
  }
}
