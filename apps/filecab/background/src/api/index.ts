import { FileCabApi } from './file-cab.api';
import { chromeStoreApi } from './chrome-store.api';
import { environment } from '@environments';

export const allApi = {
  fileCabApi: new FileCabApi(environment),
  chromeStoreApi
};