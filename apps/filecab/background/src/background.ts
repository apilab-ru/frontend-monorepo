import { environment } from '@environments';

import { EXSBackgroundWorker } from "../../../../libs/extension/src/background/background";

import { allApi } from './api';
import { Store, store$ } from './store';
import { reducers } from './reducers';

class BackgroundWorker extends EXSBackgroundWorker<Store, typeof allApi, typeof reducers> {
}

const backgroundWorker = new BackgroundWorker(
  environment,
  store$,
  reducers,
  allApi,
  //(...messages) => console.log(messages)
);

backgroundWorker.init();
