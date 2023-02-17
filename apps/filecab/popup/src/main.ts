import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from '@sentry/angular';
import { captureException } from '@sentry/angular';
import { Integrations } from '@sentry/tracing';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  Sentry.init({
    integrations: [
      new Integrations.BrowserTracing({
        tracingOrigins: ['*'],
        routingInstrumentation: Sentry.routingInstrumentation,
      }),
    ],
    ...environment.sentry,
  });

  enableProdMode();
}

if (environment.useBrowser) {
  document.body.classList.add('-browser');
}

platformBrowserDynamic().bootstrapModule(AppModule) // { ngZone: 'noop' }
  .catch(err => {
    console.error(err);

    if (environment.production) {
      captureException(err);
    }
  });
