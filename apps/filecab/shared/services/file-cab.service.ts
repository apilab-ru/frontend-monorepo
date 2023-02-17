import { Injectable } from '@angular/core';
import { ItemParam } from '@shared/services/file-cab';
import { combineLatest, Observable, of, switchMap } from 'rxjs';
import { map, pluck, shareReplay, take, tap } from 'rxjs/operators';
import { ISchema, Library, LibrarySettings } from '@shared/models/library';
import { NavigationItem } from '@shared/models/navigation';
import { SearchRequestResult } from '@filecab/models/base';
import { MetaData } from '@filecab/models/meta-data';
import { Tag } from '@shared/models/tag';
import { LibraryItem, MediaItem } from '@filecab/models/library';
import { Genre } from '@filecab/models/genre';
import { GenreKind } from '@filecab/models/genre';
import { BackgroundService } from '@filecab/background';
import { mediaCompare } from '@shared/utils/item-compare';

interface FlatLibraryItem extends LibraryItem {
  type: string;
}

interface SearchResult {
  type: string;
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileCabService {
  schemas$: Observable<Record<string, ISchema>>;
  types$: Observable<NavigationItem[]>;
  genres$: Observable<Genre[]>;

  data$: Observable<Record<string, LibraryItem[]>>;
  tags$: Observable<Tag[]>;
  store$: Observable<Library>;
  settings$: Observable<LibrarySettings>;

  constructor(
    private backgroundService: BackgroundService
  ) {
    this.schemas$ = this.backgroundService.select('config').pipe(
      map(({ schemas }) => schemas),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
    this.types$ = this.backgroundService.select('config').pipe(
      map(({ types }) => types),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
    this.genres$ = this.backgroundService.select('genres').pipe(
      shareReplay({ refCount: true, bufferSize: 1 })
    );

    this.data$ = this.backgroundService.select('data').pipe(
      shareReplay({ refCount: true, bufferSize: 1 })
    );
    this.tags$ = this.backgroundService.select('tags').pipe(
      shareReplay({ refCount: true, bufferSize: 1 })
    );

    this.store$ = combineLatest([
      this.tags$,
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
    );
  }

  updateSettings(settings: LibrarySettings): void {
    // todo test update
    this.backgroundService.reduce('user', 'updateSettings')(settings)
      .subscribe();
  }

  searchByName(name: string, type?: string): Observable<SearchResult | null> {
    return this.data$.pipe(
      take(1),
      map(store => {
        const list = this.flatStore(store, type);
        const item = list.find(it => it.name?.includes(name)
          || it.item.originalTitle?.includes(name)
          || it.item.title?.includes(name)
        );

        if (item) {
          return {
            type: item.type,
            id: item.item.id,
            name: item.name || item.item.title
          };
        }

        return null;
      })
    );
  }

  searchByUrl(url: string, type?: string): Observable<SearchResult | null> {
    return this.data$.pipe(
      take(1),
      map(store => {
        const list = this.flatStore(store, type);
        const item = list.find(it => it.url === url);

        if (item) {
          return {
            type: item.type,
            id: item.item.id,
            name: item.name || item.item.title
          };
        }

        return null;
      })
    );
  }

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

  checkExisted(path: string, item: ItemParam): Observable<boolean> {
    return this.data$.pipe(
      take(1),
      map(store => this.syncCheckExisted(store, path, item))
    );
  }

  private syncCheckExisted(data: Record<string, LibraryItem[]> | undefined, path: string, item: ItemParam): boolean {
    if (!data || !data[path]) {
      return false;
    }

    return !!data[path].find(it => mediaCompare(it.item, item) || (item.url && item.url === it.url)
    );
  }

  private flatStore(store: Record<string, LibraryItem[]>, type: string): FlatLibraryItem[] {
    return Object.entries(store)
      .sort(([pathA], [pathB]) => (pathB === type ? 1 : 0) - (pathA === type ? 1 : 0))
      .reduce((all, [type, list]) => ([
        ...all, ...list.map(item => ({ ...item, type }))
      ]), []);
  }

  addOrUpdate(path: string, item: MediaItem, metaData: MetaData): Observable<LibraryItem> {
    const libraryItem = {
      ...metaData,
      item
    };

    return this.checkExisted(path, item).pipe(
      switchMap(isExisted => isExisted ? this.updateItem(path, libraryItem) : this.addItem(path, libraryItem))
    );
  }

  addItem(path: string, item: LibraryItem): Observable<LibraryItem> {
    return this.backgroundService.reduce('library', 'addItem')({ path, item }).pipe(
      map(() => item)
    );
  }

  searchApi(path: string | undefined, name: string): Observable<SearchRequestResult<MediaItem>> {
    return !path ? of({
      page: 1,
      total_pages: 1,
      total_results: 0,
      results: []
    }) : this.backgroundService.fetch('fileCabApi', 'searchApi')([path, name]);
  }

  loadById(path: string, id: number): Observable<MediaItem> {
    return this.backgroundService.fetch('fileCabApi', 'loadById')([path, id]).pipe(
    );
  }

  deleteItem(path: string, item: MediaItem): Observable<void> {
    return this.backgroundService.reduce('library', 'deleteItem')({ path, item });
  }

  updateItem(path: string, item: LibraryItem): Observable<LibraryItem> {
    return this.backgroundService.reduce('library', 'updateItem')({ path, item }).pipe(
      map(() => item)
    );
  }

  updateStore(store: Library): Observable<void> {
    return this.backgroundService.reduce('library', 'update')(store);
  }
}
