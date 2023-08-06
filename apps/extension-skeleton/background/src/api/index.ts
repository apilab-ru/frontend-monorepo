import { boredApi } from "./bored-api";
import { makeChromeStoreApi } from "../../../../../libs/extension/src/background/api/chrome-store.api";
import { environment } from '@environments';

export const allApi = {
  boredApi,
  chromeStoreApi: makeChromeStoreApi(environment),
}
