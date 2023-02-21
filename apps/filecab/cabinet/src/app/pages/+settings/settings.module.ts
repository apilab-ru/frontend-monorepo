import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './components/settings/settings.component';
import { RouterModule } from '@angular/router';
import { MigrationComponent } from "./components/migration/migration.component";
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from "@angular/forms";
import { ButtonModule } from 'primeng/button';
import { MigrationProcessComponent } from './components/migration-process/migration-process.component';
import { MediaItemModule } from "@filecab/ui-kit/media-item";
import { MatDialogModule } from "@angular/material/dialog";
import { LibraryItemEditModule } from "@filecab/ui-kit/library-item-edit";
import { InputTextModule } from "primeng/inputtext";
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    SettingsComponent,
    MigrationComponent,
    MigrationProcessComponent,
  ],
  imports: [
    CommonModule,
    InputTextareaModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    MediaItemModule,
    LibraryItemEditModule,
    MatDialogModule,
    SkeletonModule,
    ToastModule,
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
