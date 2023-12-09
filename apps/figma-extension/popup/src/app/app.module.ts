import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CheckboxModule } from "primeng/checkbox";
import { FormsModule } from "@angular/forms";
import { UiMessagesModule } from "@apilab/ui-kit/messages";
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
    UiMessagesModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
