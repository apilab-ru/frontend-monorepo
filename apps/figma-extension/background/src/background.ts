import { allApi } from "./api";
import { Store, store$ } from "./store";
import { reducers } from "./reducers";
import { EXSBackgroundWorker } from "@apilab/extension/background";

class BackgroundWorker extends EXSBackgroundWorker<Store, typeof allApi, typeof reducers> {
}

const backgroundWorker = new BackgroundWorker(
  store$,
  reducers,
  allApi,
  //(...messages) => console.log(messages)
);

backgroundWorker.init();
reducers.config.subscribeAutoReload();
reducers.config.baseLoad();

console.log('xxx store', store$);