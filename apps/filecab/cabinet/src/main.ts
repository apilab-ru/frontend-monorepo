import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as Sentry from '@sentry/angular';
import { captureException } from '@sentry/angular';

if (environment.production) {
  enableProdMode();
}

if (environment.sentry.dsn) {
  Sentry.init({
    integrations: [Sentry.browserTracingIntegration()],
    tracePropagationTargets: ['*'],
    ...environment.sentry,
  });
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()] })
  .catch((err) => {
    console.error(err);

    if (environment.sentry.dsn) {
      captureException(err);
    }
  });
