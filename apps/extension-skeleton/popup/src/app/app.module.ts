import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Environment } from "../../../environments";
import { environment } from "../environments/environment";
import { UserModule } from "@shared/user";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserModule,
  ],
  providers: [
    {
      provide: Environment,
      useValue: environment,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
