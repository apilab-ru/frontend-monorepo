import { Injectable, NgZone } from '@angular/core';
import { CacheService } from './cache.service';
import { MediaItem, SearchRequest, SearchRequestResult } from '@server/models/index';
import { Observable } from 'rxjs';
import { runInZone } from '@shared/utils/run-in-zone';
import { BackgroundService } from 'background';

@Injectable({
  providedIn: 'root',
})
export class AnimeService {
  private readonly keyAnime = 'cache_anime';

  constructor(
    private cache: CacheService,
    private backgroundService: BackgroundService,
    private ngZone: NgZone,
  ) {
    this.cache.register<MediaItem[]>(
      this.keyAnime,
      backgroundService.fetch('fileCabApi', 'searchAnime').bind(backgroundService),
    );
  }

  findAnime(param: SearchRequest): Observable<SearchRequestResult<MediaItem>> {
    return this.cache.get<SearchRequestResult<MediaItem>>(this.keyAnime, [param]).pipe(
      runInZone(this.ngZone),
    );
  }

  getById(id: number): Observable<MediaItem> {
    return this.backgroundService.fetch('fileCabApi', 'getAnimeById')([id]).pipe(
      runInZone(this.ngZone),
    );
  }
}
