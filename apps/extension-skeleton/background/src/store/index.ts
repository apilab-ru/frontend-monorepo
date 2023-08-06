import { STORE_DATA } from "./const";
import { filter, of, shareReplay, switchMap } from "rxjs";
import { githubApi } from "@shared/github";
import { makeStore } from "../../../../../libs/store/src";
import { reactiveStore } from "../../../../filecab/shared/helpers/reactive-store";

import { allApi } from '../api';
export type Store = typeof STORE_DATA;

export const store$ = makeStore(STORE_DATA, {
  test: reactiveStore(
    () => allApi.chromeStoreApi.getStore<Store['test']>('test'),
    STORE_DATA.test
  )
});

store$.reload('repos', store$.select('user').pipe(
  filter(user => !!user),
  switchMap(user => user?.git ? githubApi.fetchRepos(user!.git) : of([])),
  shareReplay({ refCount: false, bufferSize: 1 }),
));
