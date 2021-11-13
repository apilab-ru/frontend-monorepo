import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardEditComponent } from './components/card-edit/card-edit.component';
import { HorizontalScrollDirective } from './directives/horizontal-scroll.directive';
import { FoundedListComponent } from './components/founded-list/founded-list.component';
import { PopupComponent } from './components/popup/popup.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ProgressModule } from '@shared/progress/progress.module';
import { ReactiveFormsModule } from '@angular/forms';
import { StarsModule } from '@shared/stars/stars.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoaderModule } from '@shared/loader/loader.module';

@NgModule({
  declarations: [
    CardEditComponent,
    FoundedListComponent,
    HorizontalScrollDirective,
    PopupComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    ProgressModule,
    ReactiveFormsModule,
    StarsModule,
    LoaderModule,
  ],
  exports: [
    PopupComponent,
    CardEditComponent,
  ],
})
export class PopupAddItemModule {
}
