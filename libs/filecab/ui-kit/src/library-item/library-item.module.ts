import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryItemComponent } from './components/library-item/library-item.component';
import { EditItemComponent } from './components/edit-item/edit-item.component';

import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressModule } from '../progress';
import { StarsModule } from '../stars';

@NgModule({
  declarations: [
    LibraryItemComponent,
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
    LibraryItemComponent,
    EditItemComponent,
  ]
})
export class LibraryItemModule { }
