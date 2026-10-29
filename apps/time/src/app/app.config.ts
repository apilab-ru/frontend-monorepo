import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';
import { META_REDUCERS, MetaReducer, provideStore } from '@ngrx/store';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { environment } from '../environments/environment';
import { HistoryService } from '../board/services/history.service';
import { reducers } from '../board/store/reducers';
import { history } from '../board/store/reducers/history';
import { State } from '../board/store/state';

export function getMetaReducers(historyService: HistoryService): MetaReducer<State> {
  return history(historyService);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    provideAnimationsAsync(),
    provideServiceWorker('ngsw-worker.js', { enabled: environment.production }),
    provideStore(reducers),
    provideEnvironmentNgxMask(),
    {
      provide: META_REDUCERS,
      deps: [HistoryService],
      useFactory: getMetaReducers,
      multi: true,
    },
  ],
};
