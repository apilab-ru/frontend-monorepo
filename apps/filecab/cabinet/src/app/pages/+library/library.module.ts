import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from "./components/page/page.component";
import { RouterModule, Routes } from "@angular/router";
import { LayoutTopSlotDirective } from "../../shared/directives/layout-top-slot.directive";
import { UiListModule } from "@filecab/ui-kit/list/list.module";

import { FormsModule } from "@angular/forms";
import { FilecabCardModule } from "@filecab/ui-kit/card/card.module";
import { FilterSearchModule } from "@filecab/ui-kit/filter-search/filter-search.module";
import { SelectButtonModule } from "primeng/selectbutton";

const routes: Routes = [
  {
    path: '',
    component: PageComponent,
  }
];

@NgModule({
  declarations: [
    PageComponent,
  ],
  imports: [
    CommonModule,
    LayoutTopSlotDirective,
    UiListModule,
    RouterModule.forChild(routes),
    FormsModule,
    FilecabCardModule,
    FilterSearchModule,
    SelectButtonModule,
  ]
})
export class LibraryModule {
}
