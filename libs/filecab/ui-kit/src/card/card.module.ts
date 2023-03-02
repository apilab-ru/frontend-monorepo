import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilecabCardComponent } from "./components/card/card.component";
import { LazyLoadImageModule } from "ng-lazyload-image";
import { StarsModule } from "../../../../../apps/filecab/shared/stars/stars.module";
import { FormsModule } from "@angular/forms";
import { FilecabLinkComponent } from "./components/link/link.component";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from "primeng/dropdown";
import { ProgressModule } from "../progress";
import { GenresComponent } from "./components/genres/genres.component";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
  declarations: [
    FilecabCardComponent,
    FilecabLinkComponent,
    GenresComponent,
  ],
  imports: [
    CommonModule,
    LazyLoadImageModule,
    StarsModule,
    FormsModule,
    InputTextareaModule,
    ButtonModule,
    DropdownModule,
    ProgressModule,
    MatTooltipModule,
  ],
  exports: [
    FilecabCardComponent
  ]
})
export class FilecabCardModule {
}
