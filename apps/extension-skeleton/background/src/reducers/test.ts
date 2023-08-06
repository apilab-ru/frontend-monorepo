import { Store } from "../store";
import { Reducer } from "../../../../../libs/extension/src/background/reducers/reducer";
import { allApi } from "../api";
import { StoreTest } from "../store/const";

export class TestReducer extends Reducer<Store> {

  setCounter(counter: number): void {
    const testData = this.store.test.getValue();

    this.updateStore({
      ...testData,
      counter: counter
    })
  }

  increment(): void {
    const testData = this.store.test.getValue();

    this.updateStore({
      ...testData,
      counter: ++testData.counter
    })
  }

  decrement(): void {
    const testData = this.store.test.getValue();

    this.updateStore({
      ...testData,
      counter: --testData.counter
    })
  }

  private updateStore(store: StoreTest): void {
    allApi.chromeStoreApi.pathStore('test', store);
    this.store.test.next(store);
  }
}
