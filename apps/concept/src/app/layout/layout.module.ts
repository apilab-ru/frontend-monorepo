import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from "./components/layout/layout.component";
import { UserAvatarComponent } from "./components/user-avatar/user-avatar.component";
import { SidePanelComponent } from "./components/side-panel/side-panel.component";
import { AuthComponent } from "./components/auth/auth.component";
import { MatDialogModule } from "@angular/material/dialog";
import { AuthFormComponent } from "./components/auth-form/auth-form.component";
import { SelectButtonModule } from "primeng/selectbutton";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { UiInputModule } from "@ui-kit/form/input/input.module";
import { UiButtonSelectModule } from "@ui-kit/form/button-select/button-select.module";

@NgModule({
  declarations: [
    LayoutComponent,
    UserAvatarComponent,
    SidePanelComponent,
    AuthComponent,
    AuthFormComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    SelectButtonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    UiInputModule,
    UiButtonSelectModule,
  ],
  exports: [
    LayoutComponent,
    UserAvatarComponent,
    AuthFormComponent,
  ]
})
export class LayoutModule { }
