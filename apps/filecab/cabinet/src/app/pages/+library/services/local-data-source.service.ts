import { Injectable } from '@angular/core';
import { DataSourceService } from './data-source.service';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import orderBy from 'lodash-es/orderBy';
import { FileCabService } from "@shared/services/file-cab.service";
import { PaginatorService } from "@filecab/ui-kit/list/paginator.service";
import { LibraryItemV2 } from "@filecab/models/library";
import { SearchService } from "./search.service";
import { ORDER_DEFAULT, OrderParams } from "../models/order";
import { OrderType } from "@filecab/ui-kit/list/models/order-type";
import { ConfigService } from "./config-service";

const KEY = 'localDataSource';

@Injectable()
export class LocalDataSourceService extends DataSourceService {
  constructor(
    private fileCabService: FileCabService,
    private paginatorService: PaginatorService,
    private searchService: SearchService,
    private configService: ConfigService,
  ) {
    super();
  }

  loadList(): Observable<LibraryItemV2[]> {
    const lastData = this.configService.getData<OrderParams>(KEY);

    const limit = lastData?.limit || 20;
    const orderField = lastData?.orderField || ORDER_DEFAULT;
    const orderType = lastData?.orderType || OrderType.desc;

    this.paginatorService.setLimit(limit);
    this.paginatorService.setOrderField(orderField);
    this.paginatorService.setOrderType(orderType);

    return this.makeList();
  }

  private makeList(): Observable<LibraryItemV2[]> {
    return combineLatest([
      this.paginatorService.limit$,
      this.paginatorService.orderType$,
      this.paginatorService.orderField$,
      this.getFromLibrary(),
      this.paginatorService.page$,
    ]).pipe(
      tap(([limit, orderType, orderField]) => {
        this.configService.setData<OrderParams>(KEY, { limit, orderField, orderType });

        this.state.loading.next(true);
      }),
      map(([limit, orderType, orderField, data, page]) => {
        // let list = this.searchService.filterByState(data, status);
        const list = this.sort(data, orderField, orderType);

        const start = (page - 1) * limit;
        const end = page * limit;
        const pageList = list.slice(start, end);

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
