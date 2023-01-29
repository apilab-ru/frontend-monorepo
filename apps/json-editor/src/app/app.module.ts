import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/root/app.component';
import { JsonInputComponent } from './components/json-input/json-input.component';
import { JsonEditorComponent } from "./components/json-editor/json-editor.component";
import { RouterModule } from "@angular/router";
import { ROOT_ROUTES } from "./routes";

@NgModule({
  declarations: [AppComponent, JsonInputComponent, JsonEditorComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROOT_ROUTES)
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
