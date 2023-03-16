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
import { FilterSearchData, SearchValue } from "@filecab/ui-kit/filter-search/interface";
import { SearchKeys } from "@filecab/ui-kit/filter-search/const";
import { groupBy } from "lodash-es";

const KEY = 'localDataSource';

interface SearchValueGrouped {
  positive: (string | number)[];
  negative: (string | number)[];
}

interface CompareList {
  positive: boolean[];
  negative: boolean[];
}

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
      this.searchService.data$,
    ]).pipe(
      tap(([limit, orderType, orderField]) => {
        this.configService.setData<OrderParams>(KEY, { limit, orderField, orderType });

        this.state.loading.next(true);
      }),
      map(([limit, orderType, orderField, fullData, page, searchData]) => {
        const filteredList = this.filterData(fullData, searchData);
        const list = this.sort(filteredList, orderField, orderType);

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

  private filterData(list: LibraryItemV2[], data: FilterSearchData): LibraryItemV2[] {
    const search = data.find(it => it.key === 'search')?.value as string | undefined;

    const filteredList = !search ? list : list.filter(item => {
      if (item.name?.includes(search)
        || item.item.title.includes(search)
        || item.item.originalTitle?.includes(search)
        || item.item.description?.includes(search)
      ) {
        return true;
      }

      return false;
    });

    return this.extraFilter(filteredList, data);
  }

  private extraFilter(list: LibraryItemV2[], data: FilterSearchData): LibraryItemV2[] {
    const byKeys = groupBy(data.filter(it => it.key !== 'search'), 'key');

    return list.filter(item => Object.entries(byKeys)
      .map(([key, values]) => this.checkCompare(key as SearchKeys, values, item))
      .reduce((prev, next) => prev && next, true));
  }

  private checkCompare(key: SearchKeys, value: SearchValue[], item: LibraryItemV2): boolean {
    if (!value.length) {
      return true;
    }

    const separateSearch = this.groupSearchValue(value, key);

    switch (key) {
      case SearchKeys.genres:
        const searchResGenres = this.compareList(item.item.genreIds.map(id => +id), separateSearch);
        return searchResGenres.positive.reduce((prev, next) => prev && next, true)
          && searchResGenres.negative.reduce((prev, next) => prev && next, true);

      case SearchKeys.years:
        const searchResYears = this.compareList([item.item.year], separateSearch);
        return searchResYears.positive.reduce((prev, next) => prev || next, !searchResYears.positive.length)
          && searchResYears.negative.reduce((prev, next) => prev && next, true);

      case SearchKeys.status:
        const searchResStatus = this.compareList([item.status], separateSearch);
        return searchResStatus.positive.reduce((prev, next) => prev || next, !searchResStatus.positive.length)
          && searchResStatus.negative.reduce((prev, next) => prev && next, true);

      case SearchKeys.ratingFrom:
        return item.star >= value[0].value;

      case SearchKeys.ratingTo:
        return item.star <= value[0].value;

      default:
        return true;
    }
  }

  private compareList(itemValue: (string | number)[], searchSeparate: SearchValueGrouped): CompareList {
    return {
      positive: searchSeparate.positive.map(s => (itemValue.indexOf(s) > -1)),
      negative: searchSeparate.negative.map(s => !(itemValue.indexOf(s) > -1)),
    };
  }

  private groupSearchValue(search: SearchValue[], key: SearchKeys): SearchValueGrouped {
    return {
      positive: search.filter(value => value.key === key && !value.negative).map(it => it.value),
      negative: search.filter(value => value.key === key && value.negative).map(it => it.value),
    };
  }
}
