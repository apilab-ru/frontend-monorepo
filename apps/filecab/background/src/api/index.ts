import { FileCabApi } from './file-cab.api';

import { environment } from '@environments';
import { ChromeStoreApi } from "../../../../../libs/extension/background/src/api/chrome-store.api";

export const allApi = {
  fileCabApi: new FileCabApi(environment),
  chromeStoreApi: new ChromeStoreApi(),
};