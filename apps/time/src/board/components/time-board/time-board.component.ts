import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TimeItem } from '../../models/time-item';
import { Calc } from '../../models/calc';
import { Store } from '@ngrx/store';
import { State } from '../../store/state';
import * as fromRoot from '../../store/reducers';
import * as actions from '../../store/actions';
import { combineLatest, Observable } from 'rxjs';
import { UpdateEvent } from '../../models/update-event';
import { map, take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Setting } from '../../models/setting';
import { TimeService } from '../../services/time.service';
import { HistoryService } from '../../services/history.service';
import { KeyListenerService } from '../../services/key-listener.service';
import { TaskMapService } from '../../services/task-map.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-time-board',
  templateUrl: './time-board.component.html',
  styleUrls: ['./time-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeBoardComponent implements OnInit {
  list$: Observable<TimeItem[]>;
  calculated$: Observable<Calc[]>;
  setting: Setting;
  totalTime$: Observable<string>;
  totalHours$: Observable<string>;

  constructor(
    private timeService: TimeService,
    private store: Store<State>,
    private historyService: HistoryService,
    private keyListenerService: KeyListenerService,
    private snackBar: MatSnackBar,
    private taskMapService: TaskMapService
  ) {
    this.list$ = store.select(fromRoot.getList);
    this.calculated$ = store.select(fromRoot.getCalcList);
    this.setting = this.timeService.getSetting();
  }

  ngOnInit(): void {
    const totalTimeMinutes$ = this.list$
      .pipe(
        map(list => list.reduce((prev, next) => this.timeService.getTime(next) + prev, 0))
      );

    this.totalTime$ = totalTimeMinutes$
      .pipe(
        map(minutes => this.timeService.getStringHourMinute(minutes))
      );

    this.totalHours$ = totalTimeMinutes$.pipe(
      map(minutes => (minutes / 60).toFixed(2))
    );

    this.keyListenerService
      .listener(['ControlLeft', 'KeyZ'])
      .subscribe(() => {
        this.store.dispatch(new actions.Undo());
      });

    this.keyListenerService
      .listener(['ControlLeft', 'KeyQ'])
      .subscribe(() => {
        this.reCalc();
      });
  }

  undo(): void {
    this.store.dispatch(new actions.Undo());
  }

  onUpdateItem(event: UpdateEvent<TimeItem>): void {
    this.store.dispatch(new actions.Update(event));
  }

  onDeleteItem(index: number): void {
    this.store.dispatch(new actions.Delete(index));
  }

  addItem(): void {
    this.store.dispatch(new actions.Add(this.genItem()));
  }

  clear(): void {
    this.store.dispatch(new actions.Clear());
  }

  reload(): void {
    this.store.dispatch(new actions.Reload());
  }

  genItem(): TimeItem {
    return TimeService.genItem();
  }

  reCalc(): void {
    combineLatest([
      this.list$,
      this.taskMapService.taskMap$
    ]).pipe(take(1))
      .subscribe(([timeList, taskMap]) => {
        this.store.dispatch(new actions.SetCalculationList(
          this.timeService.calcTime(timeList, this.timeService.getSetting(), taskMap)
        ));
      });
  }

  changeSort(event: MatCheckboxChange): void {
    const setting = this.timeService.getSetting();
    setting.sort = event.checked;
    this.timeService.saveSetting(setting);
  }

  changeGroup(event: MatCheckboxChange): void {
    const setting = this.timeService.getSetting();
    setting.groupByDescription = event.checked;
    this.timeService.saveSetting(setting);
  }

  changeTimeReorder(event: MatCheckboxChange): void {
    const setting = this.timeService.getSetting();
    setting.timeReorder = event.checked;
    this.timeService.saveSetting(setting);
  }

  getHourAndMinutes(minutes: number): string {
    return this.timeService.getStringHourMinute(minutes);
  }

  delete(index: number): void {
    this.store.dispatch(new actions.DeleteCalculationItem(index));
  }
}
