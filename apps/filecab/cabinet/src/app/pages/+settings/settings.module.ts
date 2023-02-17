import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './components/settings/settings.component';
import { RouterModule } from '@angular/router';
import { MigrationComponent } from "./components/migration/migration.component";
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from "@angular/forms";
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    SettingsComponent,
    MigrationComponent,
  ],
  imports: [
    CommonModule,
    InputTextareaModule,
    FormsModule,
    ButtonModule,
    RouterModule.forChild([
      {
        path: '',
        component: SettingsComponent
      }
    ])
  ]
})
export class SettingsModule {
}
