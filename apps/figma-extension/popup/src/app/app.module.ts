import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Environment } from "../../../environments";
import { environment } from "../environments/environment";
import { CheckboxModule } from "primeng/checkbox";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CheckboxModule,
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
