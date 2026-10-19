import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiListComponent } from './components/list/list.component';
import { UiListIteratorDirective } from './list-iterator-directive';
import { UiPaginatorComponent } from './components/paginator/paginator.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UiListComponent, UiListIteratorDirective, UiPaginatorComponent],
  imports: [CommonModule, ButtonModule, RippleModule, SelectModule, FormsModule],
  exports: [UiListComponent, UiListIteratorDirective],
})
export class UiListModule {}
