import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressComponent } from './components/progress/progress.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProgressComponent
  ],
  imports: [
    CommonModule,
    InputNumberModule,
    FormsModule,
  ],
  exports: [
    ProgressComponent,
  ]
})
export class ProgressModule { }
