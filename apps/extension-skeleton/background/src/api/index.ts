import { boredApi } from "./bored-api";
import { ChromeStoreApi } from "../../../../../libs/extension/src/background/api/chrome-store.api";

export const allApi = {
  boredApi,
  chromeStoreApi: new ChromeStoreApi(),
}
