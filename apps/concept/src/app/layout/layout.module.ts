import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from "./components/layout/layout.component";
import { UserAvatarComponent } from "./components/user-avatar/user-avatar.component";
import { SidePanelComponent } from "./components/side-panel/side-panel.component";

@NgModule({
  declarations: [
    LayoutComponent,
    UserAvatarComponent,
    SidePanelComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LayoutComponent,
    UserAvatarComponent,
  ]
})
export class LayoutModule { }
