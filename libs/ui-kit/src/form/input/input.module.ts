import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiInputComponent } from "./input.component";
import { InputTextModule } from "primeng/inputtext";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PasswordModule } from "primeng/password";

@NgModule({
  declarations: [
    UiInputComponent,
  ],
  imports: [
    CommonModule,
    InputTextModule,
    ReactiveFormsModule,
    FormsModule,
    PasswordModule,
  ],
  exports: [
    UiInputComponent,
  ]
})
export class UiInputModule {
}
