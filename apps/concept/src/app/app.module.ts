import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LayoutModule } from "./layout/layout.module";
import { RouterModule } from "@angular/router";
import { APP_ROUTES } from "./routes/routes";
import { ApiModule } from "@api/module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    LayoutModule,
    ApiModule,
    RouterModule.forRoot(APP_ROUTES),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
