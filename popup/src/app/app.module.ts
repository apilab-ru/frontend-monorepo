import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PopupAddItemModule } from '@shared/popup-add-item/popup-add-item.module';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PopupImportComponent } from './components/import/import.component';
import { Environment } from '../../../../environments';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    PopupImportComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    PopupAddItemModule,
    MatButtonModule,
    MatSnackBarModule,
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
