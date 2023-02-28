import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { combineLatest, map, Observable, shareReplay, switchMap } from "rxjs";
import { Types } from "@filecab/models/types";
import { LibraryItemV2 } from "@filecab/models/library";
import { FileCabService } from "@shared/services/file-cab.service";
import { PaginatorService } from "@filecab/ui-kit/list/paginator.service";
import { LocalDataSourceService } from "../../services/local-data-source.service";
import { SearchService } from "../../services/search.service";
import { LOCAL_ORDER_FIELDS } from "../../models/order";

@Component({
  selector: 'cabinet-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    PaginatorService,
    SearchService,
    LocalDataSourceService,
  ],
})
export class PageComponent implements OnInit {
  limitList = [12, 20, 50, 100];
  orderFields = LOCAL_ORDER_FIELDS;
  list$: Observable<LibraryItemV2[]>;

  constructor(
    private localDataSourceService: LocalDataSourceService,
  ) {
  }

  ngOnInit(): void {
    this.list$ = this.localDataSourceService.loadList().pipe(
      shareReplay({ refCount: true, bufferSize: 1 }),
    );

    this.list$.subscribe(list => console.log('xxx list', list))
  }

  trackById(_index: number, item: LibraryItemV2): number {
    return item.item.id;
  }
}
