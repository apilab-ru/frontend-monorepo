import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Environment } from '@environments/model';
import { environment } from '../environments/environment';
import { LibraryItemModule } from '@filecab/ui-kit/library-item';
import { EditItemComponent } from './components/edit-item/edit-item.component';
import { RouterModule } from '@angular/router';
import { ROUTES } from './routes';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    EditItemComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    LibraryItemModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
    SelectButtonModule,
    FormsModule,
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
