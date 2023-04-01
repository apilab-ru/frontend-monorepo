import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap
} from "rxjs";
import { makeStore } from "@store";
import { Types } from "@filecab/models/types";
import { MetaDataV2 } from "@filecab/models/meta-data";
import { LibraryItemV2, MediaItemV2 } from "@filecab/models/library";
import { extractSearchId, SearchId } from "@filecab/models";
import { filterUndefined } from "@store/rxjs/filter-undefined";
import { StatusList } from "@filecab/models/status";
import { FileCabService } from "@shared/services/file-cab.service";
import { Injectable } from "@angular/core";

const BASE_STORE_DATA = {
  type: undefined as Types | undefined,
  url: undefined as string | undefined,
  name: undefined as string | undefined,
  metaData: undefined as MetaDataV2 | undefined,
  mediaItem: undefined as MediaItemV2 | undefined,
  mediaSearchId: undefined as SearchId | undefined,
  isLoadingMeta: true,
  isLoadingList: false,
  isSearchMode: false,
  hasChanges: false,
  manualMode: false,
};

@Injectable()
export abstract class EditContext {
  protected libraryItem$: Observable<LibraryItemV2 | null>;
  protected store = makeStore(BASE_STORE_DATA);

  type$ = this.store.type.pipe(filterUndefined());
  name$ = this.store.name.pipe(filterUndefined());
  metaData$ = this.store.metaData.pipe(filterUndefined());
  mediaItem$ = this.store.mediaItem.pipe(filterUndefined());
  isLoadingMeta$ = this.store.isLoadingMeta.asObservable();
  isLoadingList$ = this.store.isLoadingList.asObservable();
  isSearchMode$ = this.store.isSearchMode.asObservable();
  hasChanges$ = this.store.hasChanges.asObservable();
  isAvailable$: Observable<boolean>;

  constructor(
    protected filecabService: FileCabService,
  ) {
    this.libraryItem$ = this.loadLibraryItem().pipe(
      shareReplay({ refCount: true, bufferSize: 1 }),
    );
  }

  abstract init(): Observable<void>;

  abstract saveItem(meta: Partial<MetaDataV2>): void;

  abstract buildMediaList(): Observable<MediaItemV2[] | undefined>;

  setSearchMode(isSearchMode: boolean): void {
    this.store.isSearchMode.next(isSearchMode);
  }

  setType(type: Types): void {
    this.store.type.next(type);
  }

  setName(name: string): void {
    this.store.name.next(name);
  }

  selectItem(item: MediaItemV2): void {
    this.store.mediaItem.next(item);
    this.store.hasChanges.next(true);

    const mediaSearch = extractSearchId(item);

    this.store.mediaSearchId.next(mediaSearch);
    this.setSearchMode(false);
    this.store.manualMode.next(true);

    if (!this.store.name.value) {
      this.store.name.next(item.title);
    }

    if (!this.store.metaData.value?.status) {
      this.store.metaData.next({
        ...this.store.metaData.value,
        status: StatusList.planned,
      })
    }
  }

  protected abstract loadLibraryItem(): Observable<LibraryItemV2 | null>;

  protected updateMetaDataByLibrary(): Observable<void> {
    return this.libraryItem$.pipe(
      filter(item => !!item),
      map(libraryItem => {
        if (!this.store.manualMode.value) {
          this.store.type.next(libraryItem.type);
          const { item, ...metaData } = libraryItem;
          this.store.metaData.next(metaData);
          this.store.mediaItem.next(item);
        }

        if (libraryItem?.name && !this.store.name.value) {
          this.store.name.next(libraryItem.name);
        }

        if (libraryItem?.url !== this.store.url.value) {
          this.store.hasChanges.next(true);
        }
      })
    )
  }

  protected buildApiMediaList(): Observable<MediaItemV2[]> {
    return this.store.isSearchMode.pipe(
      filter(Boolean),
      switchMap(() => combineLatest([
        this.store.type.pipe(filterUndefined()),
        this.store.name.pipe(filterUndefined()),
      ])),
      tap(() => this.store.isLoadingList.next(true)),
      switchMap(([type, name]) => this.filecabService.searchInApi({ name }, type).pipe(
        map(res => res.results),
        catchError(error => {
          console.log('error build list', error);
          return of([]);
        }),
      )),
      tap(() => this.store.isLoadingList.next(false)),
    )
  }

  protected loadLibraryItemByName(): Observable<LibraryItemV2 | null> {
    return combineLatest([
      this.store.type.pipe(filterUndefined(), distinctUntilChanged()),
      this.store.name.pipe(filterUndefined(), distinctUntilChanged())
    ]).pipe(
      debounceTime(10),
      tap(() => this.store.isLoadingList.next(true)),
      switchMap(([type, name]) => this.filecabService.searchByName(name, type)),
      tap(() => this.store.isLoadingList.next(false)),
    )
  }

  protected loadLibraryItemBySearchId(): Observable<LibraryItemV2 | null> {
    return this.store.mediaSearchId.pipe(
      debounceTime(10),
      switchMap(item => !item ? of(null) : this.filecabService.searchByMedia(item))
    )
  }
}
