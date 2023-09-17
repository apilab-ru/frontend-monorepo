import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Environment } from "@environments/model";
import { environment } from "../environments/environment";
import { CheckboxModule } from "primeng/checkbox";
import { FormsModule } from "@angular/forms";
import {UiInputModule} from "@ui-kit/form/input/input.module";
import { UiMessagesModule } from "@ui-kit/messages/messages.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    CheckboxModule,
    UiInputModule,
    UiMessagesModule,
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
