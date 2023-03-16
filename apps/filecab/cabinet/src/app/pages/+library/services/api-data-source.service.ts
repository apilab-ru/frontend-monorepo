import { Injectable } from "@angular/core";
import { DataSourceService } from "./data-source.service";
import { combineLatest, debounceTime, map, Observable, switchMap } from "rxjs";
import { LibraryItemV2 } from "@filecab/models/library";
import { FileCabService } from "@shared/services/file-cab.service";
import { ConfigService } from "./config-service";
import { ORDER_DEFAULT, OrderParams } from "../models/order";
import { OrderType } from "@filecab/ui-kit/list/models/order-type";
import { PaginatorService } from "@filecab/ui-kit/list/paginator.service";
import { SearchService } from "./search.service";
import { tap } from "rxjs/operators";
import { BackgroundService, FileCabApi } from "@filecab/background";
import { environment } from "../../../../environments/environment";


const KEY = 'apiDataSource';

@Injectable()
export class ApiDataSourceService extends DataSourceService {
  private fileCabApi = new FileCabApi(environment);

  constructor(
    private backgroundService: BackgroundService,
    private configService: ConfigService,
    private paginatorService: PaginatorService,
    private searchService: SearchService,
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
      this.paginatorService.page$,
      this.searchService.type$,
      this.searchService.data$,
    ]).pipe(
      debounceTime(10),
      tap(([limit, orderType, orderField]) => {
        this.configService.setData<OrderParams>(KEY, { limit, orderField, orderType });

        this.state.loading.next(true);
      }),
      switchMap(([limit, orderType, orderField, page, type, data]) => this.fileCabApi.searchApi({
        limit,
        page,
        name: data.find(it => it.key === 'search')?.value + '',
      }, type).pipe(
        map(response => {
          this.paginatorService.setTotal(response.total_results);

          return response.results.map(item => ({ item, type }));
        }),
      )),
      tap(() => {
        this.state.loading.next(false);
      }),
    )
  }
}