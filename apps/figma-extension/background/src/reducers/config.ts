import { Store } from "../store";
import { Reducer } from "@apilab/extension/background";
import { from, interval, map, NEVER, Observable, of, switchMap, tap } from "rxjs";
import { allApi } from "../api";
import { ConfigRule, ConfigRules } from "@shared/config-rules";

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

  subscribeAutoReload(): void {
    this.store.select('config').pipe(
      switchMap(({ reloadEnable }) => !reloadEnable ? NEVER : interval(5000)),
      switchMap(() => this.loadConfig())
    ).subscribe();
  }

  baseLoad(): void {
    this.loadConfig().subscribe();
  }

  loadConfig(): Observable<ConfigRules> {
    return from(fetch('./config.json').then(res => res.json())).pipe(
      map(rules => this.parserRules(rules)),
      tap(rules => this.update({ rules }))
    );
  }

  private parserRules(response: Record<string, ConfigRule>): ConfigRules {
    const rules = Object.values(response);

    const replaceTokenPart = ' [day]';

    rules.forEach(rule => {
      const tokens = Object.entries(rule.map);
      tokens.forEach(([key, value]) => {
        if (key.includes(replaceTokenPart)) {
          rule.map[key.replace(replaceTokenPart, '')] = value;
        }
      })
    })

    return rules;
  }

  private updateStore(store: Store['config']): void {
    allApi.chromeStoreApi.pathStore('config', store);

    this.store.config.next(store);
  }

}
