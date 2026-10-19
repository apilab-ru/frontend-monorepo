import { provideFilecabTheme } from '@filecab/ui-kit/theme/prime-ng.providers';
import * as Sentry from '@sentry/angular';
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, inject, provideAppInitializer } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Environment } from '@environments/model';
import { environment } from '../environments/environment';
import { MenuComponent } from './components/menu/menu.component';
import { RouterModule } from '@angular/router';
import { ROUTES } from './routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [AppComponent, MenuComponent],
  bootstrap: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
    ToastModule,
  ],
  providers: [
    provideFilecabTheme(),
    { provide: Sentry.TraceService, deps: [Router] },
    provideAppInitializer(() => {
      inject(Sentry.TraceService);
    }),
    {
      provide: Environment,
      useValue: environment,
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
