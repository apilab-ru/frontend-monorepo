import { FileCabApi } from './file-cab.api';

import { environment } from '@environments';
import { makeChromeStoreApi } from "../../../../../libs/extension/src/background/api/chrome-store.api";

export const allApi = {
  fileCabApi: new FileCabApi(environment),
  chromeStoreApi: makeChromeStoreApi(environment),
};