import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PaginatorService } from "../../paginator.service";
import { DropdownItem, OrderField } from "../../models/interface";
import { DROPDOWN_LIST, OrderType } from "../../models/order-type";

@Component({
  selector: 'filecab-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiPaginatorComponent implements OnChanges {
  @Input() limitList: number[];
  @Input() orderFields: OrderField[];

  limitViewList: DropdownItem[];
  orderTypeList = DROPDOWN_LIST;

  page$ = this.paginatorService.page$;
  hasMore$ = this.paginatorService.hasMore$;
  canGoToLast$ = this.paginatorService.canGoToLast$;
  totalPages$ = this.paginatorService.totalPages$;
  limit$ = this.paginatorService.limit$;
  orderField$ = this.paginatorService.orderField$;
  orderType$ = this.paginatorService.orderType$;

  constructor(
    private paginatorService: PaginatorService,
  ) {
  }

  ngOnChanges({ limitList }: SimpleChanges): void {
    if (limitList) {
      this.limitViewList = this.limitList.map(key => ({ key, name: key }))
    }
  }

  prevPage(): void {
    this.paginatorService.prevPage();
  }

  setPage(page: number): void {
    this.paginatorService.setPage(page);
  }

  nextPage(): void {
    this.paginatorService.nextPage();
  }

  lastPage(): void {
    this.paginatorService.goToLastPage();
  }

  setOrderField(field: string): void {
    this.paginatorService.setOrderField(field);
  }

  setOrderType(type: OrderType): void {
    this.paginatorService.setOrderType(type);
  }
}
