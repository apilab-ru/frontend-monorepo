import { Injectable } from '@angular/core';
import { DataSourceService } from './data-source.service';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import orderBy from 'lodash-es/orderBy';
import { FileCabService } from "@shared/services/file-cab.service";
import { PaginatorService } from "@filecab/ui-kit/list/paginator.service";
import { LibraryItemV2 } from "@filecab/models/library";
import { SearchService } from "./search.service";
import { ORDER_DEFAULT } from "../models/order";
import { OrderType } from "@filecab/ui-kit/list/models/order-type";

@Injectable()
export class LocalDataSourceService extends DataSourceService {
  /*state = makeStore({
    hasMore: false,
    loading: true,
    total: 0,
  });
  state$: Observable<DataSourceState> = this.state.select();*/

  constructor(
    private fileCabService: FileCabService,
    private paginatorService: PaginatorService,
    private searchService: SearchService,
  ) {
    super();
  }

  loadList(): Observable<LibraryItemV2[]> {
    this.paginatorService.setLimit(20);
    this.paginatorService.setOrderField('createAt');

    return this.makeList();
  }

  private makeList(): Observable<LibraryItemV2[]> {
    return combineLatest([
      this.getFromLibrary(),
      this.paginatorService.page$,
      this.paginatorService.limit$,
      this.paginatorService.orderType$,
      this.paginatorService.orderField$,
    ]).pipe(
      tap(() => {
        this.state.loading.next(true);
      }),
      map(([data, page, limit, orderType, orderField]) => {
        // let list = this.searchService.filterByState(data, status);
        const list = this.sort(data, orderField, orderType);

        const start = (page - 1) * limit;
        const end = page * limit;
        const pageList = list.slice(start, end);

        console.log('xxx start', start, end, pageList);

        this.paginatorService.setTotal(list.length);

        return pageList;
      }),
      tap(() => {
        this.state.loading.next(false);
      }),
    );
  }

  private getFromLibrary(): Observable<LibraryItemV2[]> {
    return combineLatest([
      this.searchService.type$,
      this.fileCabService.data$,
    ]).pipe(
      map(([type, data]) => data.filter(item => item.type === type)),
    );
  }

  private sort(list: LibraryItemV2[], orderField: string, orderType: OrderType): LibraryItemV2[] {
    return orderBy(list, orderField, orderType);
  }
}
