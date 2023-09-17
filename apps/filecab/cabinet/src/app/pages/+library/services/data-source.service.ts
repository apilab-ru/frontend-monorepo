import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { DataSourceState } from "../models/data-source-state";
import { makeStore } from "@store";
import { LibraryItemV2 } from "@filecab/models/library";
import { ORDER_DEFAULT, OrderParams } from "../models/order";
import { OrderType } from "@filecab/ui-kit/list/models/order-type";
import { ConfigService } from "./config-service";
import { PaginatorService } from "@filecab/ui-kit/list/paginator.service";
import { SearchService } from "./search.service";

@Injectable()
export abstract class DataSourceService {
  protected storeKey: string;
  protected state = makeStore({
    // hasMore: false,
    loading: true,
    // total: undefined as number | null | undefined,
  });

  constructor(
    protected configService: ConfigService,
    protected paginatorService: PaginatorService,
    protected searchService: SearchService,
  ) {
  }

  loadList(): Observable<LibraryItemV2[]> {
    const lastData = this.configService.getData<OrderParams>(this.storeKey);

    const limit = lastData?.limit || 20;
    const orderField = lastData?.orderField || ORDER_DEFAULT;
    const orderType = lastData?.orderType || OrderType.desc;
    const data = lastData?.data || [];

    this.searchService.setData(data)

    this.paginatorService.setLimit(limit);
    this.paginatorService.setOrderField(orderField);
    this.paginatorService.setOrderType(orderType);

    return this.makeList();
  }

  protected abstract makeList(): Observable<LibraryItemV2[]>;
}

