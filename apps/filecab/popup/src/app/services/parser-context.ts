import { EditContext } from "./edit-context";
import { Injectable } from "@angular/core";
import { MetaDataV2 } from "@filecab/models/meta-data";
import {
  catchError,
  combineLatest,
  filter,
  map,
  merge,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
  take
} from "rxjs";
import { LibraryItemV2, MediaItemV2 } from "@filecab/models/library";
import { ParserSchemas } from "@filecab/parser/schemas";
import { FileCabService } from "@shared/services/file-cab.service";
import { BrowserApiService } from "./browser-api.service";
import { Types } from "@filecab/models/types";
import { UiMessagesService } from "@ui-kit/messages/messages.service";


@Injectable()
export class ParserContext extends EditContext {
  isAvailable$ = of(true);

  constructor(
    protected filecabService: FileCabService,
    private parserSchemas: ParserSchemas,
    private browserApiService: BrowserApiService,
    private uiMessageService: UiMessagesService,
  ) {
    super(filecabService);
  }

  init(): Observable<void> {
    this.store.isLoadingMeta.next(false);
    this.setSearchMode(true)

    return merge(
      this.loadBrowserData(),
      this.updateMetaDataByLibrary(),
    )
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

  buildMediaList(): Observable<MediaItemV2[] | undefined> {
    const mediaResultList$ = this.buildApiMediaList();

    return combineLatest([
      this.libraryItem$,
      mediaResultList$.pipe(startWith(null)),
    ]).pipe(
      map(([item, list]) => !list ? (item ? [item.item] : undefined) : list)
    );
  }

  protected loadLibraryItem(): Observable<LibraryItemV2 | null> {
    return combineLatest([
      this.loadLibraryItemByName(),
      this.loadLibraryItemBySearchId(),
    ]).pipe(
      map(([byName, byId]) => byId || byName),
      catchError(error => {
        console.log('error load library', error);

        return of(null);
      }),
    );
  }

  private loadBrowserData(): Observable<void> {
    return this.browserApiService.getActiveTab().pipe(
      switchMap(tab => {
        const { domain, url } = this.browserApiService.getTabLinks(tab);
        const schema = this.parserSchemas.getParserSchema(domain, url);

        if (schema) {
          return this.browserApiService.executeScriptOnTab(tab.id, schema.func)
        }

        return of(undefined)
      }),
      filter(Boolean),
      map(item => {
        console.log('xxx parser', item);

        this.store.name.next(item.title);
        this.store.type.next(item.type as Types || Types.films);
      }),
      catchError(() => of(undefined)),
    )
  }
}