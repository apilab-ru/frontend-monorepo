import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiListComponent } from "./components/list/list.component";
import { UiListIteratorDirective } from "./list-iterator-directive";
import { UiPaginatorComponent } from "./components/paginator/paginator.component";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    UiListComponent,
    UiListIteratorDirective,
    UiPaginatorComponent,
  ],
  imports: [
    CommonModule,
    ButtonModule,
    RippleModule,
    DropdownModule,
    FormsModule,
  ],
  exports: [
    UiListComponent,
    UiListIteratorDirective,
  ]
})
export class UiListModule { }
