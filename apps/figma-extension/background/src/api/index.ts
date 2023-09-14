import { makeChromeStoreApi } from "../../../../../libs/extension/src/background/api/chrome-store.api";
import { environment } from '@environments';

export const allApi = {
  chromeStoreApi: makeChromeStoreApi(environment),
}
