import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterSearchComponent } from "./components/root/filter-search.component";
import { ReactiveFormsModule } from "@angular/forms";
import { DropdownComponent } from "./components/dropdown/dropdown.component";
import { OverlayModule } from "@angular/cdk/overlay";
import { InputComponent } from "./components/input/input.component";
import { ChipComponent } from "./components/chip/chip.component";

@NgModule({
  declarations: [
    FilterSearchComponent,
    DropdownComponent,
    InputComponent,
    ChipComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OverlayModule,
  ],
  exports: [
    FilterSearchComponent
  ]
})
export class FilterSearchModule { }
