import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, shareReplay } from "rxjs";
import { LibraryItemV2 } from "@filecab/models/library";
import { PaginatorService } from "@filecab/ui-kit/list/paginator.service";
import { LocalDataSourceService } from "../../services/local-data-source.service";
import { SearchService } from "../../services/search.service";
import { LOCAL_ORDER_FIELDS } from "../../models/order";
import { FileCabService } from "@shared/services/file-cab.service";
import { MessageService } from "primeng/api";

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
    private filecabService: FileCabService,
    private messageService: MessageService,
  ) {
  }

  ngOnInit(): void {
    this.list$ = this.localDataSourceService.loadList().pipe(
      shareReplay({ refCount: true, bufferSize: 1 }),
    );
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
