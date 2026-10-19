import { type ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { ROOT_ROUTES } from './routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(ROOT_ROUTES),
    provideAnimations(),
    importProvidersFrom(NgxPageScrollCoreModule),
  ],
};
