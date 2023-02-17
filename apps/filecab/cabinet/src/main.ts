import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as Sentry from '@sentry/angular';
import { Integrations } from '@sentry/tracing';
import { captureException } from '@sentry/angular';

if (environment.production) {
  enableProdMode();
}

if (environment.sentry.dsn) {
  Sentry.init({
    integrations: [
      new Integrations.BrowserTracing({
        tracingOrigins: ['*'],
        routingInstrumentation: Sentry.routingInstrumentation,
      }),
    ],
    ...environment.sentry,
  });
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => {
    console.error(err);

    if (environment.sentry.dsn) {
      captureException(err);
    }
  });
