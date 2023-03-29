import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiButtonSelectComponent } from "./button-select.component";
import { SelectButtonModule } from "primeng/selectbutton";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    UiButtonSelectComponent,
  ],
  imports: [
    CommonModule,
    SelectButtonModule,
    FormsModule,
  ],
  exports: [
    UiButtonSelectComponent,
  ]
})
export class UiButtonSelectModule { }
