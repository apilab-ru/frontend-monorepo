import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputTextModule } from "primeng/inputtext";
import { RadioButtonModule } from "primeng/radiobutton";
import { SelectButtonModule } from "primeng/selectbutton";
import { ProgressModule } from "../progress";
import { StarsModule } from "../stars";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EditItemComponent } from "./components/edit-item/edit-item.component";

@NgModule({
  declarations: [
    EditItemComponent,
  ],
  imports: [
    CommonModule,
    ButtonModule,
    DropdownModule,
    InputTextareaModule,
    InputTextModule,
    RadioButtonModule,
    SelectButtonModule,

    ProgressModule,
    StarsModule,

    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    EditItemComponent,
  ]
})
export class LibraryItemEditModule {
}
