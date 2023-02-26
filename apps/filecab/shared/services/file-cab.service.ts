import { Injectable } from '@angular/core';
import { ItemParam } from '@shared/services/file-cab';
import { Observable, switchMap, tap } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { Library, LibrarySettings } from '@shared/models/library';
import { LibraryItemV2, MediaItemV2 } from '@filecab/models/library';
import { Genre } from '@filecab/models/genre';
import { BackgroundService } from '@filecab/background';
import { SearchRequestResult, AnimeSearchV2Query, FilmSearchParams, SearchId } from "@filecab/models";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { MetaData, MetaDataV2 } from "../../../../libs/filecab/models/src/meta-data";
import { uiDateISO } from "../../../../libs/ui-kit/src/time/date-iso";

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class FileCabService {
  genres$: Observable<Genre[]>;

  data$: Observable<LibraryItemV2[]>;
  // store$: Observable<Library>;
  // settings$: Observable<LibrarySettings>;

  constructor(
    private backgroundService: BackgroundService
  ) {
    this.genres$ = this.backgroundService.select('genres').pipe(
      shareReplay({ refCount: false, bufferSize: 1 }),
      untilDestroyed(this),
    );

    this.data$ = this.backgroundService.select('data').pipe(
      shareReplay({ refCount: false, bufferSize: 1 }),
      untilDestroyed(this),
    );

    // this.data$.subscribe(data => console.log('xxx data', data));

    /*this.store$ = combineLatest([
      this.data$,
      this.backgroundService.select('lastTimeUpdate')
    ]).pipe(
      map(([tags, data, lastTimeUpdate]) => ({
        tags, data, lastTimeUpdate
      })),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
    this.settings$ = this.backgroundService.select('settings').pipe(
      shareReplay({ refCount: true, bufferSize: 1 })
    );*/
  }

  updateSettings(settings: LibrarySettings): void {
    // todo test update
    this.backgroundService.reduce('user', 'updateSettings')(settings)
      .subscribe();
  }

  searchByMedia(params: SearchId): Observable<LibraryItemV2 | null> {
    return this.data$.pipe(
      take(1),
      map(list => {
        const fields = Object.entries(params);

        const result = list.find(item => {
          // @ts-ignore
          return fields.some(([key, value]) => item.item[key] === value)
        })

        return result || null;
      }),
    )
  }

  searchByName(name: string, type?: string): Observable<LibraryItemV2 | null> {
    return this.data$.pipe(
      take(1),
      map(list => {
        const results = list.filter(it => it.name?.includes(name)
          || it.item.originalTitle?.includes(name)
          || it.item.title?.includes(name)
        );

        if (results.length === 1) {
          return results[0];
        }

        if (results.length) {
          const filteredByType = results.filter(it => it.type === type);
          if (filteredByType.length === 1) {
            return filteredByType[0];
          }
        }

        return null;
      })
    );
  }

  searchByUrl(url: string): Observable<LibraryItemV2 | null> {
    return this.data$.pipe(
      take(1),
      map(list => {
        const item = list.find(it => it.url === url);

        return item || null;
      })
    );
  }

  searchInApi(param: AnimeSearchV2Query | FilmSearchParams, type: string): Observable<SearchRequestResult<MediaItemV2>> {
    return this.backgroundService.fetch('fileCabApi', 'searchApi')([param, type]);
  }

  addOrUpdate(item: MediaItemV2, metaData: MetaDataV2): Observable<LibraryItemV2> {
    const libraryItem: LibraryItemV2 = {
      ...metaData,
      dateAd: metaData.dateAd || uiDateISO(new Date()),
      dateChange: uiDateISO(new Date()),
      item
    };

    return this.checkExisted(item.id).pipe(
      switchMap(isExisted => isExisted ? this.updateItem(libraryItem) : this.addItem(libraryItem)),
      map(() => libraryItem),
    );
  }

  checkExisted(id: number): Observable<boolean> {
    return this.data$.pipe(
      take(1),
      map(store => !!store.find(it => it.item.id === id))
    );
  }

  addItem(item: LibraryItemV2): Observable<void> {
    return this.backgroundService.reduce('library', 'addItem')({ item });
  }

  updateItem(item: LibraryItemV2): Observable<LibraryItemV2> {
    return this.backgroundService.reduce('library', 'updateItem')({ item }).pipe(
      map(() => item)
    );
  }

  deleteItem(id: number): Observable<void> {
    return this.backgroundService.reduce('library', 'deleteItem')({ id });
  }

  /*

  selectGenres(type: string): Observable<Genre[]> {
    return this.genres$.pipe(
      map(list => list.filter(genre => genre.kind.includes(type as GenreKind)))
    );
  }

  searchInStore(
    path: string,
    item: ItemParam
  ): Observable<LibraryItem | null> {
    return this.data$.pipe(
      take(1),
      pluck(path),
      map(list => list?.find(
        it => it.item.title === item.name
          || it.url === item.url
          || it.name === item.name
      ) || null)
    );
  }

  loadById(path: string, id: number): Observable<MediaItem> {
    return this.backgroundService.fetch('fileCabApi', 'loadById')([path, id]).pipe(
    );
  }

  */

  updateStore(store: Library): Observable<void> {
    return this.backgroundService.reduce('library', 'update')(store);
  }
}
