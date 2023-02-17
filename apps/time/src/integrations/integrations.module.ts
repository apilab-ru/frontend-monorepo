import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntegrationsComponent } from "./components/integrations/integrations.component";
import { IntegrationItemComponent } from "./components/integration-item/integration-item.component";
import { MatButtonModule } from "@angular/material/button";
import { IntegrationEditComponent } from "./components/integration-edit/integration-edit.component";
import { MatDialogModule } from "@angular/material/dialog";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IntegrationProcessComponent } from "./components/integration-process/integration-process.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgxMaskDirective } from "ngx-mask";

@NgModule({
  declarations: [
    IntegrationsComponent,
    IntegrationItemComponent,
    IntegrationEditComponent,
    IntegrationProcessComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    FormsModule,
    NgxMaskDirective,
  ],
  exports: [
    IntegrationsComponent,
  ]
})
export class IntegrationsModule {
}
