import { Injectable } from "@angular/core";
import { DataSourceService } from "./data-source.service";
import { combineLatest, debounceTime, map, Observable, switchMap } from "rxjs";
import { LibraryItemV2 } from "@filecab/models/library";
import { ConfigService } from "./config-service";
import { OrderParams } from "../models/order";
import { PaginatorService } from "@filecab/ui-kit/list/paginator.service";
import { SearchService } from "./search.service";
import { tap } from "rxjs/operators";
import { FileCabApi } from "@filecab/background";
import { environment } from "../../../../environments/environment";

const KEY = 'apiDataSource';

@Injectable()
export class ApiDataSourceService extends DataSourceService {
  private fileCabApi = new FileCabApi(environment);
  protected storeKey = KEY;

  constructor(
    protected configService: ConfigService,
    protected paginatorService: PaginatorService,
    protected searchService: SearchService,
  ) {
    super(configService, paginatorService, searchService);
  }

  protected makeList(): Observable<LibraryItemV2[]> {
    return combineLatest([
      this.paginatorService.limit$,
      this.paginatorService.orderType$,
      this.paginatorService.orderField$,
      this.searchService.data$,
      this.paginatorService.page$,
      this.searchService.type$,
    ]).pipe(
      debounceTime(10),
      tap(([limit, orderType, orderField, data]) => {
        this.configService.setData<OrderParams>(this.storeKey, { limit, orderField, orderType, data });

        this.state.loading.next(true);
      }),
      switchMap(([limit, orderType, orderField, data, page, type]) => this.fileCabApi.searchApi({
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