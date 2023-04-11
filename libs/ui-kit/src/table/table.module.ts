import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiTableComponent } from "./components/table/table.component";
import { UiHeadComponent } from "./components/head/head.component";
import { UiTableIteratorDirective } from './directives/iterator.directive';
import { UiTableTdDirective } from "./directives/td.directive";
import { UiTableTrDirective } from "./directives/tr.directive";

@NgModule({
  declarations: [
    UiTableComponent,
    UiHeadComponent,
    UiTableIteratorDirective,
    UiTableTdDirective,
    UiTableTrDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UiTableComponent,
    UiHeadComponent,
    UiTableIteratorDirective,
    UiTableTdDirective,
    UiTableTrDirective,
  ]
})
export class UiTableModule { }
