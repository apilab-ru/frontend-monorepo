import { MediaItem, SearchRequest, SearchRequestResult } from '@server/models/index';
import { Observable, throwError } from 'rxjs';
import { environment } from '@environments';
import { fetchObservable } from '@shared/utils/fetch-observable';
import { Genre } from '@server/models/genre';

class FileCabApi {
  private api = environment.apiUrl;

  loadById(path: string, id: number): Observable<MediaItem> {
    switch (path) {
      case 'anime':
        return this.getAnimeById(id);
    }
  }

  searchApi(path: string, name: string): Observable<SearchRequestResult<MediaItem>> {
    switch (path) {
      case 'anime':
        return this.searchAnime({ name });

      case 'films':
        return this.searchFilm({ name });

      case 'tv':
        return this.searchTv({ name });

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
    return fetchObservable<SearchRequestResult<MediaItem>>(this.api + 'films/v2/movie?name=' + queryParam.toString());
  }

  searchTv(param: SearchRequest): Observable<SearchRequestResult<MediaItem>> {
    const queryParam = this.prepareParams(param);
    return fetchObservable<SearchRequestResult<MediaItem>>(this.api + 'films/v2/tv?name=' + queryParam.toString());
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

export const fileCabApi = new FileCabApi();
