import { Store } from "../store";
import { Reducer } from "../../../../../libs/extension/src/background/reducers/reducer";
import { from, interval, NEVER, Observable, of, switchMap, tap } from "rxjs";
import { allApi } from "../api";
import { ConfigRules } from "@shared/config-rules";

export class ConfigReducer extends Reducer<Store> {

  update(config: Partial<Store['config']>): Observable<void> {
    const lastValue = this.store.get().config;

    this.updateStore({
      ...lastValue,
      ...config
    })

    return of(undefined);
  }

  subscribeAutoReload(): void {
    this.store.select('config').pipe(
      switchMap(({ reloadEnable }) => !reloadEnable ? NEVER : interval(5000)),
      switchMap(() => this.loadConfig())
    ).subscribe();
  }

  loadConfig(): Observable<ConfigRules> {
    return from(fetch('./config.json').then(res => res.json())).pipe(
      tap(rules => this.update({ rules }))
    );
  }

  private updateStore(store: Store['config']): void {
    allApi.chromeStoreApi.pathStore('config', store);

    this.store.config.next(store);
  }

}
