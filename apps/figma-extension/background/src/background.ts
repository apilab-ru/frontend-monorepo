import { allApi } from "./api";
import { Store, store$ } from "./store";
import { reducers } from "./reducers";
import { EXSBackgroundWorker } from "../../../../libs/extension/background";

class BackgroundWorker extends EXSBackgroundWorker<Store, typeof allApi, typeof reducers> {
}

const backgroundWorker = new BackgroundWorker(
  store$,
  reducers,
  allApi,
  //(...messages) => console.log(messages)
);

backgroundWorker.init();

console.log('backgroundWorker', backgroundWorker);