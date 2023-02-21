import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaItemComponent } from './components/media-item/media-item.component';

@NgModule({
  declarations: [
    MediaItemComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MediaItemComponent
  ],
})
export class MediaItemModule {
}
