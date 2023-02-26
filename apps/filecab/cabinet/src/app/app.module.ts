import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Environment } from '@environments/model';
import { environment } from '../environments/environment';
import { MenuComponent } from './components/menu/menu.component';
import { RouterModule } from "@angular/router";
import { ROUTES } from "./routes";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
  ],
  providers: [
    {
      provide: Environment,
      useValue: environment,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
