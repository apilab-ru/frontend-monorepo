import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { LibraryItemV2 } from "@filecab/models/library";
import { PaginatorService } from "@filecab/ui-kit/list/paginator.service";
import { LocalDataSourceService } from "../../services/local-data-source.service";
import { SearchService } from "../../services/search.service";
import { LOCAL_ORDER_FIELDS } from "../../models/order";
import { FileCabService } from "@shared/services/file-cab.service";
import { MessageService } from "primeng/api";
import { LibraryMode } from "../../models/mode";
import { ApiDataSourceService } from "../../services/api-data-source.service";
import { LibrarySourceService } from "../../services/library-source.service";
import { FilterSearchData } from "@filecab/ui-kit/filter-search/interface";
import { BASE_SEARCH_VALUES } from "@filecab/ui-kit/filter-search/const";

@Component({
  selector: 'cabinet-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    PaginatorService,
    SearchService,
    LocalDataSourceService,
    ApiDataSourceService,
    LibrarySourceService,
  ],
})
export class PageComponent implements OnInit {
  limitList = [12, 20, 50, 100];
  orderFields = LOCAL_ORDER_FIELDS;
  LibraryMode = LibraryMode;
  filterList = BASE_SEARCH_VALUES;

  list$: Observable<LibraryItemV2[]>;
  mode$ = this.searchService.mode$;
  searchData$: Observable<FilterSearchData>;

  constructor(
    private librarySourceService: LibrarySourceService,
    private filecabService: FileCabService,
    private messageService: MessageService,
    private searchService: SearchService,
  ) {
  }

  ngOnInit(): void {
    this.list$ = this.librarySourceService.list$;
    this.searchData$ = this.searchService.data$;
  }

  changeMode(mode: LibraryMode): void {
    this.searchService.setMode(mode);
  }

  onUpdateSearch(data: FilterSearchData): void {
    this.searchService.setData(data);
  }

  trackById(_index: number, item: LibraryItemV2): number {
    return item.item.id;
  }

  onUpdateItem(item: LibraryItemV2): void {
    this.filecabService.updateItem(item).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        detail: 'Done!'
      })
    })
  }

  onDeleteItem(id: number): void {
    this.filecabService.deleteItem(id).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        detail: 'Done!'
      })
    })
  }
}
