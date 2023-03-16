import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Environment } from '@environments/model';
import { environment } from '../environments/environment';
import { EditItemComponent } from './components/edit-item/edit-item.component';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { ROUTES } from './routes';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { LibraryItemEditModule } from "@filecab/ui-kit/library-item-edit";
import { MediaItemListComponent } from "./components/media-item-list/media-item-list.component";
import { SkeletonModule } from 'primeng/skeleton';
import { MediaItemModule } from "@filecab/ui-kit/media-item";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { UiKitHorizontalScrollDirective } from "@ui-kit/scroll/horizontal-scroll.directive";
import { UiMessagesModule } from "@ui-kit/messages/messages.module";
import { DefaultRouteReuseStrategy } from "./services/stop-resuse.router-strategy";

@NgModule({
  declarations: [
    AppComponent,
    EditItemComponent,
    MediaItemListComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    LibraryItemEditModule,
    MediaItemModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
    SelectButtonModule,
    ButtonModule,
    FormsModule,
    SkeletonModule,
    RippleModule,
    UiKitHorizontalScrollDirective,
    UiMessagesModule,
  ],
  providers: [
    {
      provide: Environment,
      useValue: environment,
    },
    {
      provide: RouteReuseStrategy,
      useClass: DefaultRouteReuseStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
