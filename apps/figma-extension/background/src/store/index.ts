import { STORE_DATA } from "./const";
import { makeStore, reactiveStore } from "@apilab/store";

import { allApi } from '../api';
export type Store = typeof STORE_DATA;

export const store$ = makeStore(STORE_DATA, {
  config: reactiveStore(
    () => allApi.chromeStoreApi.getStore<Store['config']>('config'),
    STORE_DATA.config
  )
});
