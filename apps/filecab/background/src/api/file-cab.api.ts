import { MediaItem, SearchRequest, SearchRequestResult } from '@filecab/models';
import { Observable, throwError } from 'rxjs';
import { fetchObservable } from '@shared/utils/fetch-observable';
import { Genre } from '@filecab/models/genre';
import { Environment } from "@environments/model";

export class FileCabApi {
  constructor(
    private env: Environment,
  ) {
  }
  private api = this.env.apiUrl;

  // @ts-ignore
  loadById(path: string, id: number): Observable<MediaItem> {
    switch (path) {
      case 'anime':
        return this.getAnimeById(id);
    }
  }

  searchApi(path: string, name: string, limit = 50): Observable<SearchRequestResult<MediaItem>> {
    switch (path) {
      case 'anime':
        return this.searchAnime({ name, limit });

      case 'films':
        return this.searchFilm({ name, limit });

      case 'tv':
        return this.searchTv({ name, limit });

      default:
        return throwError(() => `Path ${name} not support`);
    }
  }

  searchAnime(param: SearchRequest): Observable<SearchRequestResult<MediaItem>> {
    const queryParam = this.prepareParams(param);
    return fetchObservable<SearchRequestResult<MediaItem>>(this.api + 'anime/v2/search?' + queryParam.toString());
  }

  getAnimeById(id: number): Observable<MediaItem> {
    return fetchObservable<MediaItem>(this.api + 'anime/v2/' + id);
  }

  searchFilm(param: SearchRequest): Observable<SearchRequestResult<MediaItem>> {
    const queryParam = this.prepareParams(param);
    return fetchObservable<SearchRequestResult<MediaItem>>(this.api + 'films/v2/movie?' + queryParam.toString());
  }

  searchTv(param: SearchRequest): Observable<SearchRequestResult<MediaItem>> {
    const queryParam = this.prepareParams(param);
    return fetchObservable<SearchRequestResult<MediaItem>>(this.api + 'films/v2/tv?' + queryParam.toString());
  }

  loadGenres(): Observable<Genre[]> {
    return fetchObservable<Genre[]>(this.api + `genres/list`);
  }

  private prepareParams<T>(params: T): URLSearchParams {
    const clearedParams = Object.entries(params)
      .filter(([key, value]) => !!value)
      .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {});

    return new URLSearchParams(
      clearedParams,
    );
  }
}
