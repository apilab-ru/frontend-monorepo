import { makeStore } from './helpers';
import { STORE_DATA } from './const';
import { shareReplay } from 'rxjs';
import { allApi } from '../api';
import { reactiveStore } from '@shared/helpers/reactive-store';
import { libraryApi } from '../api/library-api';

export type Store = typeof STORE_DATA;

export const store$ = makeStore(STORE_DATA);

store$.reload('genres', allApi.fileCabApi.loadGenres().pipe(
  shareReplay({ refCount: false, bufferSize: 1 }),
));
/*store$.reload('settings', allApi.chromeStoreApi.getGlobalStorage<LibrarySettings>().pipe(
  startWith({}),
));*/

store$.reload('data', reactiveStore(
  () => libraryApi.loadData(),
));
/*store$.reload('tags', reactiveStore(
  () => libraryApi.loadTags(),
));*/
store$.reload('lastTimeUpdate', reactiveStore(
  () => libraryApi.loadLastTimeUpdate(),
));
