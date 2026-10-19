import { EXSBackgroundWorker } from "../../../../libs/extension/background/src/background";

import { allApi } from './api';
import { Store, store$ } from './store';
import { reducers } from './reducers';

class BackgroundWorker extends EXSBackgroundWorker<Store, typeof allApi, typeof reducers> {
}

const backgroundWorker = new BackgroundWorker(
  store$,
  reducers,
  allApi,
  //(...messages) => console.log(messages)
);

backgroundWorker.init();
