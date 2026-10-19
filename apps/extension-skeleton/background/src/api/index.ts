import { boredApi } from "./bored-api";
import { ChromeStoreApi } from "../../../../../libs/extension/background/src/api/chrome-store.api";

export const allApi = {
  boredApi,
  chromeStoreApi: new ChromeStoreApi(),
}
