import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from '@sentry/angular';
import { captureException } from '@sentry/angular';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  Sentry.init({
    integrations: [Sentry.browserTracingIntegration()],
    tracePropagationTargets: ['*'],
    ...environment.sentry,
  });

  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()] }) // { ngZone: 'noop' }
  .catch((err) => {
    console.error(err);

    if (environment.production) {
      captureException(err);
    }
  });
