import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from "./components/page/page.component";
import { RouterModule, Routes } from "@angular/router";
import { LayoutTopSlotDirective } from "../../shared/directives/layout-top-slot.directive";
import { UiListModule } from "@filecab/ui-kit/list/list.module";
import { CardComponent } from "./components/card/card.component";

const routes: Routes = [
  {
    path: '',
    component: PageComponent,
  }
];

@NgModule({
  declarations: [
    PageComponent,
    CardComponent,
  ],
  imports: [
    CommonModule,
    LayoutTopSlotDirective,
    UiListModule,
    RouterModule.forChild(routes)
  ]
})
export class LibraryModule {
}
