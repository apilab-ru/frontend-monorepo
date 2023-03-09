import { Injectable } from "@angular/core";
import { makeStore } from "@store";
import { combineLatest, map, Observable, tap } from "rxjs";
import { filterUndefined } from "@store/rxjs/filter-undefined";
import { OrderType } from "./models/order-type";

@Injectable()
export class PaginatorService {
  page$: Observable<number>;
  hasMore$: Observable<boolean>;
  canGoToLast$: Observable<boolean>;
  limit$: Observable<number>;
  orderType$: Observable<OrderType>;
  orderField$: Observable<string>;
  totalPages$: Observable<number | undefined>;

  private store = makeStore({
    page: 1,
    limit: undefined as undefined | number,
    total: undefined as number | null | undefined,
    hasMore: undefined as boolean | undefined,
    orderField: undefined as string | undefined,
    orderType: undefined as OrderType | undefined,
  })

  constructor() {
    this.page$ = this.store.page.asObservable();

    this.hasMore$ = combineLatest([
      this.store.limit.pipe(filterUndefined()),
      this.store.page,
      this.store.total,
      this.store.hasMore,
    ]).pipe(
      map(([limit, page, total, hasMore]) => {
        if (total) {
          return (page * limit) < total;
        }

        return !!hasMore;
      })
    );
    this.canGoToLast$ = combineLatest([
      this.hasMore$,
      this.store.total
    ]).pipe(
      map(([hasMore, total]) => hasMore && !!total),
    );

    this.limit$ = this.store.limit.pipe(filterUndefined());

    this.orderType$ = this.store.orderType.asObservable().pipe(filterUndefined());
    this.orderField$ = this.store.orderField.pipe(filterUndefined());

    this.totalPages$ = combineLatest([
      this.limit$,
      this.store.total,
    ]).pipe(
      map(([limit, total]) => !limit || !total ? undefined : this.calcLastPage(total, limit)),
    );
  }

  setTotal(total: number | null): void {
    this.store.total.next(total);
  }

  setOrderField(field: string): void {
    this.store.orderField.next(field);
  }

  setOrderType(type: OrderType): void {
    this.store.orderType.next(type);
  }

  setLimit(limit: number): void {
    this.store.limit.next(limit);
  }

  prevPage(): void {
    const page = this.store.page.getValue();
    this.setPage(page - 1);
  }

  nextPage(): void {
    const page = this.store.page.getValue();
    this.setPage(page + 1);
  }

  setPage(page: number): void {
    this.store.page.next(page);
  }

  goToLastPage(): void {
    const total = this.store.total.getValue()!;
    const limit = this.store.limit.getValue()!;
    const page = this.calcLastPage(total, limit);
    this.setPage(page);
  }

  private calcLastPage(total: number, limit: number): number {
    return Math.ceil(total / limit);
  }
}