import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryItemComponent } from './components/library-item/library-item.component';

@NgModule({
  declarations: [
    LibraryItemComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    LibraryItemComponent,
  ]
})
export class LibraryItemModule {
}
