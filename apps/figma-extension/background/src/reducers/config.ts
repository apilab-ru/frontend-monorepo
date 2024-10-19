import { Store } from "../store";
import { Reducer } from "../../../../../libs/extension/background";
import { from, Observable, of, tap } from "rxjs";
import { allApi } from "../api";
import { ConfigRules } from "@shared/config-rules";

export class ConfigReducer extends Reducer<Store> {

  update(config: Partial<Store['config']>): Observable<void> {
    let lastValue = this.store.get().config;

    if ((lastValue as any)['config']) {
      lastValue = {} as Store['config'];
    }

    this.updateStore({
      ...lastValue,
      ...config
    })

    return of(undefined);
  }

  loadConfig(): Observable<ConfigRules | null> {
    return from(allApi.configApi.loadRulesJson()).pipe(
      tap(rules => rules && this.update({ rules }))
    );
  }

  private updateStore(store: Store['config']): void {
    allApi.chromeStoreApi.pathStore('config', store);

    this.store.config.next(store);
  }

}
