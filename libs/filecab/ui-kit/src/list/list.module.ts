import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { UiListComponent } from "./components/list/list.component";
import { UiListIteratorDirective } from "./list-iterator-directive";
import { UiPaginatorComponent } from "./components/paginator/paginator.component";

@NgModule({
  declarations: [
    UiListComponent,
    UiListIteratorDirective,
    UiPaginatorComponent,
  ],
  imports: [
    CommonModule,
    PaginatorModule,
  ],
  exports: [
    UiListComponent,
    UiListIteratorDirective,
  ]
})
export class UiListModule { }
