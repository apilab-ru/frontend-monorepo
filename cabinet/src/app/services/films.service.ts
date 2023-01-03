import { Injectable, NgZone } from '@angular/core';
import { CacheService } from './cache.service';
import { MediaItem, SearchRequest, SearchRequestResult } from '../../models';
import { Observable } from 'rxjs';
import { runInZone } from '@shared/utils/run-in-zone';
import { BackgroundService } from 'background';


@Injectable({
  providedIn: 'root',
})
export class FilmsService {
  private readonly keyMovie = 'cache_movie';
  private readonly keyTv = 'cache_tv';

  constructor(
    private cache: CacheService,
    private backgroundService: BackgroundService,
    private ngZone: NgZone,
  ) {
    this.cache.register<SearchRequestResult<MediaItem>>(
      this.keyMovie,
      backgroundService.fetch('fileCabApi', 'searchFilm').bind(backgroundService),
    );

    this.cache.register<SearchRequestResult<MediaItem>>(
      this.keyTv,
      backgroundService.fetch('fileCabApi', 'searchTv').bind(backgroundService),
    );
  }

  findMovie(param: SearchRequest): Observable<SearchRequestResult<MediaItem>> {
    return this.cache.get<SearchRequestResult<MediaItem>>(this.keyMovie, [param]).pipe(
      runInZone(this.ngZone),
    );
  }

  findTv(param: SearchRequest): Observable<SearchRequestResult<MediaItem>> {
    return this.cache.get<SearchRequestResult<MediaItem>>(this.keyTv, [param]).pipe(
      runInZone(this.ngZone),
    );
  }
}
