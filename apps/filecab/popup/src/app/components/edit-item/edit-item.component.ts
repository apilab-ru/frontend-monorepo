import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';
import { BrowserApiService } from '../../services/browser-api.service';
import { ParserSchemas } from '@filecab/parser/schemas';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of, shareReplay,
  startWith,
  switchMap, take,
  tap
} from 'rxjs';
import { makeStore } from '@store';
import { Types } from '@filecab/models/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filterUndefined } from '@store/rxjs/filter-undefined';
import { FileCabService } from "@shared/services/file-cab.service";
import { LibraryItemV2, MediaItemV2 } from "@filecab/models/library";
import { MetaDataV2 } from "@filecab/models/meta-data";
import { Genre } from "@filecab/models/genre";
import { UiMessagesService } from "@ui-kit/messages/messages.service";
import { extractSearchId, SearchId } from "@filecab/models";
import { StatusList } from "@filecab/models/status";

const STORE = {
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
  isAvailable: false,
  manualMode: false,
};

@UntilDestroy()
@Component({
  selector: 'popup-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditItemComponent implements OnInit {
  private parserSchemas = new ParserSchemas();
  private store = makeStore(STORE);

  type$ = this.store.type.pipe(filterUndefined());
  name$ = this.store.name.pipe(filterUndefined());
  metaData$ = this.store.metaData.pipe(filterUndefined());
  mediaItem$ = this.store.mediaItem.pipe(filterUndefined());
  isLoadingMeta$ = this.store.isLoadingMeta.asObservable();
  isLoadingList$ = this.store.isLoadingList.asObservable();
  isSearchMode$ = this.store.isSearchMode.asObservable();
  hasChanges$ = this.store.hasChanges.asObservable();
  isAvailable$ = this.store.isAvailable.asObservable();

  libraryItem$: Observable<LibraryItemV2 | null>;
  mediaResultList$: Observable<MediaItemV2[] | undefined>;
  genres$: Observable<Genre[]>;

  constructor(
    private browserApiService: BrowserApiService,
    private filecabService: FileCabService,
    private uiMessageService: UiMessagesService,
  ) {
  }

  ngOnInit(): void {
    this.loadBrowserData();

    this.genres$ = this.filecabService.genres$;

    this.libraryItem$ = this.loadLibraryItem().pipe(
      shareReplay({ refCount: true, bufferSize: 1 }),
    );

    this.libraryItem$.pipe(
      untilDestroyed(this)
    ).subscribe(libraryItem => {

      if (libraryItem && !this.store.manualMode.value) {
        this.store.type.next(libraryItem.type);
        const { item, ...metaData } = libraryItem;
        this.store.metaData.next(metaData);
        this.store.mediaItem.next(item);
      }

      if (libraryItem?.name && !this.store.name.value) {
        this.store.name.next(libraryItem.name);
      }
    })

    this.libraryItem$.pipe(
      take(1),
      untilDestroyed(this)
    ).subscribe(libraryItem => {
      if (!libraryItem) {
        this.setSearchMode(true);
      }
    });

    const mediaResultList$ = this.buildApiMediaList();

    this.mediaResultList$ = combineLatest(
      this.libraryItem$,
      mediaResultList$.pipe(startWith(null)),
    ).pipe(
      map(([item, list]) => !list ? (item ? [item.item] : undefined) : list)
    );
  }

  setSearchMode(isSearchMode: boolean): void {
    this.store.isSearchMode.next(isSearchMode);
  }

  onSelectItem(item: MediaItemV2): void {
    this.store.mediaItem.next(item);
    this.store.hasChanges.next(true);

    const mediaSearch = extractSearchId(item);

    this.store.mediaSearchId.next(mediaSearch);
    this.setSearchMode(false);
    this.store.manualMode.next(true);

    if (!this.store.name.value) {
      this.store.name.next(item.title);
    }

    console.log('select item', item);

    if (!this.store.metaData.value?.status) {
      this.store.metaData.next({
        ...this.store.metaData.value,
        status: StatusList.planned,
      })
    }
  }

  onTypeChange(type: Types): void {
    this.store.type.next(type);
  }

  onNameChange(name: string): void {
    this.store.name.next(name);
  }

  onSaveItem(meta: Partial<MetaDataV2>): void {
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
        untilDestroyed(this)
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

  private buildApiMediaList(): Observable<MediaItemV2[]> {
    return this.store.isSearchMode.pipe(
      filter(Boolean),
      switchMap(() => combineLatest(
        this.store.type.pipe(filterUndefined()),
        this.store.name.pipe(filterUndefined()),
      )),
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

  private loadBrowserData(): void {
    this.browserApiService.getActiveTab()
      .pipe(
        tap(() => this.store.isAvailable.next(true)),
        switchMap(tab => {
          const { url, domain } = this.browserApiService.getTabLinks(tab);
          const schema = this.parserSchemas.getSchema(domain);

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
          this.store.isAvailable.next(false);

          return of(null);
        }),
        tap(() => this.store.isLoadingMeta.next(false)),
        filter(Boolean),
        untilDestroyed(this),
      )
      .subscribe({
        next: ({ item, url, type }) => {
          const mediaSearchId = item ? extractSearchId(item) : undefined;

          this.store.update({
            type: (item?.type as Types) || type,
            url,
            name: (item?.title) || '',
            mediaSearchId
          });
        }
      });
  }

  private loadLibraryItem(): Observable<LibraryItemV2 | null> {
    const byUrl$ = this.store.url.pipe(
      filterUndefined(),
      take(1),
      debounceTime(10),
      tap(() => this.store.isLoadingList.next(true)),
      switchMap(url => this.filecabService.searchByUrl(url)),
      tap(() => this.store.isLoadingList.next(false)),
    );

    const byName$ = combineLatest([
      this.store.type.pipe(filterUndefined(), distinctUntilChanged()),
      this.store.name.pipe(filterUndefined(), distinctUntilChanged())
    ]).pipe(
      debounceTime(10),
      tap(() => this.store.isLoadingList.next(true)),
      switchMap(([type, name]) => this.filecabService.searchByName(name, type)),
      tap(() => this.store.isLoadingList.next(false)),
    );

    const bySearchId$ = this.store.mediaSearchId.pipe(
      debounceTime(10),
      switchMap(item => !item ? of(null) : this.filecabService.searchByMedia(item))
    )

    return combineLatest([
      byUrl$,
      byName$,
      bySearchId$,
    ]).pipe(
      tap(res => console.log('xxx res', res)),
      map(([byUrl, byName, byId]) => byId || byUrl || byName),
      catchError(error => {
        console.log('error load library', error);

        return of(null);
      }),
    );
  }
}
