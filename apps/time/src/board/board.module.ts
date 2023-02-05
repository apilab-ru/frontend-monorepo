import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CopyClickDirective } from './directives/copy-click.directive';
import { TimeComponent } from './components/time/time.component';
import { TotalTimePipe } from './pipes/total-time.pipe';
import { TimeBoardComponent } from './components/time-board/time-board.component';
import { ItemComponent } from './components/item/item.component';
import { TimeBoardListComponent } from './components/list/list.component';
import { TimeDtoPipe } from './pipes/time-dto.pipe';
import { TaskMappingComponent } from './components/task-mapping/task-mapping.component';
import { BoardPageComponent } from './components/board-page/board-page.component';
import { META_REDUCERS, MetaReducer, StoreModule } from '@ngrx/store';
import { HistoryService } from './services/history.service';
import { reducers } from './store/reducers';
import { history } from './store/reducers/history';
import { State } from './store/state';
import { TaskMapItemComponent } from './components/task-map-item/task-map-item.component';

export function getMetaReducers(
  historyService: HistoryService
): MetaReducer<State>[] {
  return [
    history(historyService)
  ];
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatSnackBarModule,
    NgxMaskModule.forRoot(),
    ReactiveFormsModule,
    RouterModule,
    StoreModule.forRoot(reducers),
  ],
  declarations: [
    BoardPageComponent,
    CopyClickDirective,
    ItemComponent,
    TaskMapItemComponent,
    TaskMappingComponent,
    TimeBoardComponent,
    TimeBoardListComponent,
    TimeComponent,
    TimeDtoPipe,
    TotalTimePipe,
  ],
  providers: [
    {
      provide: META_REDUCERS,
      deps: [HistoryService],
      useFactory: getMetaReducers
    }
  ],
  exports: [
    BoardPageComponent
  ]
})
export class BoardModule {
}
