import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CheckboxModule } from "primeng/checkbox";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { UiMessagesService } from "./messages.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    CheckboxModule,
    ToastModule,
  ],
  providers: [
    MessageService,
    UiMessagesService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
