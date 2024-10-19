import { STORE_DATA } from "./const";
import { makeStore, reactiveStore } from "@apilab/store";

import { allApi } from '../api';
import { of, switchMap } from "rxjs";
export type Store = typeof STORE_DATA;

const loadConfig = () => allApi.chromeStoreApi.getStore<Store['config']>('config').pipe(
  switchMap(config => !config ? allApi.configApi.loadConfig(STORE_DATA.config) : of(config))
)

export const store$ = makeStore(STORE_DATA, {
  config: reactiveStore(
    loadConfig,
    STORE_DATA.config
  )
});
