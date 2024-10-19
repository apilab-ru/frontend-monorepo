import { ChromeStoreApi } from "../../../../../libs/extension/background";
import { ConfigApi } from "./config";

export const allApi = {
  chromeStoreApi: new ChromeStoreApi(),
  configApi: new ConfigApi()
}
