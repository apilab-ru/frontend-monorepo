import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/root/app.component';
import { JsonInputComponent } from './components/json-input/json-input.component';
import { JsonEditorComponent } from "./components/json-editor/json-editor.component";
import { RouterModule } from "@angular/router";
import { ROOT_ROUTES } from "./routes";
import { MenuComponent } from "./components/menu/menu.component";
import { JsonRowComponent } from "./components/json-row/json-row.component";

@NgModule({
  declarations: [
    AppComponent,
    JsonInputComponent,
    JsonEditorComponent,
    JsonRowComponent,
    MenuComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROOT_ROUTES)
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
