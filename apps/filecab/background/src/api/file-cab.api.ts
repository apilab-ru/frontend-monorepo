import { AnimeSearchV2Query, FilmSearchParams, SearchRequest, SearchRequestResult } from '@filecab/models';
import { Observable, throwError } from 'rxjs';
import { fetchObservable } from '@shared/utils/fetch-observable';
import { Genre } from '@filecab/models/genre';
import { Environment } from "@environments/model";
import { MediaItemV2 } from "@filecab/models/library";

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

  searchApi({ param, type }: { param: AnimeSearchV2Query | FilmSearchParams, type: string }): Observable<SearchRequestResult<MediaItemV2>> {
    if (!param.limit) {
      param.limit = 50;
    }

    switch (type) {
      case 'anime':
        return this.searchAnime(param);

      case 'films':
        return this.searchFilm(param);

      case 'tv':
        return this.searchTv(param);

      default:
        return throwError(() => `Path ${type} not support`);
    }
  }

  searchAnime(param: AnimeSearchV2Query): Observable<SearchRequestResult<MediaItemV2>> {
    const queryParam = this.prepareParams(param);
    return fetchObservable<SearchRequestResult<MediaItemV2>>(this.api + 'anime/v2/search?' + queryParam.toString());
  }

  getAnimeById(id: number): Observable<MediaItemV2> {
    return fetchObservable<MediaItemV2>(this.api + 'anime/v2/' + id);
  }

  searchFilm(param: FilmSearchParams): Observable<SearchRequestResult<MediaItemV2>> {
    const queryParam = this.prepareParams(param);
    return fetchObservable<SearchRequestResult<MediaItemV2>>(this.api + 'films/v2/movie?' + queryParam.toString());
  }

  searchTv(param: FilmSearchParams): Observable<SearchRequestResult<MediaItemV2>> {
    const queryParam = this.prepareParams(param);
    return fetchObservable<SearchRequestResult<MediaItemV2>>(this.api + 'films/v2/tv?' + queryParam.toString());
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
