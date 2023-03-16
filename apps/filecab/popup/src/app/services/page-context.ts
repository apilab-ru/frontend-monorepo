import { EditContext } from "./edit-context";
import { Injectable } from "@angular/core";
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable,
  of,
  shareReplay, startWith,
  switchMap,
  take,
  tap
} from "rxjs";
import { extractSearchId } from "@filecab/models";
import { Types } from "@filecab/models/types";
import { BrowserApiService } from "./browser-api.service";
import { ParserSchemas } from "@filecab/parser/schemas";
import { LibraryItemV2, MediaItemV2 } from "@filecab/models/library";
import { filterUndefined } from "@store/rxjs/filter-undefined";
import { FileCabService } from "@shared/services/file-cab.service";
import { MetaDataV2 } from "@filecab/models/meta-data";
import { UiMessagesService } from "@ui-kit/messages/messages.service";

@Injectable()
export class PageContext extends EditContext {
  isAvailable$ = new BehaviorSubject(false);

  constructor(
    private browserApiService: BrowserApiService,
    protected filecabService: FileCabService,
    private uiMessageService: UiMessagesService,
    protected parserSchemas: ParserSchemas,
  ) {
    super(filecabService);
  }

  init(): Observable<void> {
    return merge(
      this.loadBrowserData(),
      this.updateMetaDataByLibrary(),
      this.initMode(),
    );
  }

  buildMediaList(): Observable<MediaItemV2[] | undefined> {
    const mediaResultList$ = this.buildApiMediaList();

    return combineLatest(
      this.libraryItem$,
      mediaResultList$.pipe(startWith(null)),
    ).pipe(
      map(([item, list]) => !list ? (item ? [item.item] : undefined) : list)
    );
  }

  saveItem(meta: Partial<MetaDataV2>): void {
    this.store.metaData.next({
      ...this.store.metaData.value,
      name: this.store.name.value,
      url: this.store.url.value,
      ...meta,
      type: this.store.type.value,
    });

    if (this.store.mediaItem) {
      this.store.hasChanges.next(false);

      this.filecabService.addOrUpdate(
        this.store.mediaItem.value!,
        this.store.metaData.value!
      ).pipe(
        take(1),
      ).subscribe({
        next: () => {
          this.uiMessageService.success({ detail: 'Сохранено' })
        },
        error: (error: Error) => {
          this.uiMessageService.error({ detail: error.message })
        }
      })
    }
  }

  private initMode(): Observable<void> {
    return this.libraryItem$.pipe(
      take(1),
      filter(item => !item),
      map(() => this.setSearchMode(true)),
    );
  }

  protected loadLibraryItem(): Observable<LibraryItemV2 | null> {
    const byUrl$ = this.store.url.pipe(
      filterUndefined(),
      take(1),
      debounceTime(10),
      tap(() => this.store.isLoadingList.next(true)),
      switchMap(url => this.filecabService.searchByUrl(url)),
      tap(() => this.store.isLoadingList.next(false)),
    );

    const byName$ = this.loadLibraryItemByName();

    const bySearchId$ = this.loadLibraryItemBySearchId();

    return combineLatest([
      byUrl$,
      byName$,
      bySearchId$,
    ]).pipe(
      map(([byUrl, byName, byId]) => byId || byUrl || byName),
      catchError(error => {
        console.log('error load library', error);

        return of(null);
      }),
    );
  }

  private loadBrowserData(): Observable<void> {
    return this.browserApiService.getActiveTab()
      .pipe(
        tap(() => this.isAvailable$.next(true)),
        switchMap(tab => {
          const { url, domain } = this.browserApiService.getTabLinks(tab);
          const schema = this.parserSchemas.getImportSchema(domain);

          return this.browserApiService.executeScriptOnTab(tab.id, schema.func).pipe(
            map(item => ({
              item,
              url,
              type: schema.type
            }))
          );
        }),
        catchError((er) => {
          console.log('error', er);
          this.isAvailable$.next(false);

          return of(null);
        }),
        tap(() => this.store.isLoadingMeta.next(false)),
        filter(Boolean),
        map(({ item, url, type }) => {
          const mediaSearchId = item ? extractSearchId(item) : undefined;

          this.store.update({
            type: (item?.type as Types) || type,
            url,
            name: (item?.title) || '',
            mediaSearchId
          });
        }),
      );
  }
}