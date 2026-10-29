import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { TimeItem } from '../../models/time-item';
import { Store } from '@ngrx/store';
import { State } from '../../store/state';
import * as fromRoot from '../../store/reducers';
import * as actions from '../../store/actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UpdateEvent } from '../../models/update-event';
import { Setting } from '../../models/setting';
import { TimeService } from '../../services/time.service';
import { KeyListenerService } from '../../services/key-listener.service';
import { TaskMapService } from '../../services/task-map.service';
import { MatCheckboxChange, MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { TimeBoardListComponent } from '../list/list.component';
import { FormsModule } from '@angular/forms';
import { CopyClickDirective } from '../../directives/copy-click.directive';
import { TimeDtoPipe } from '../../pipes/time-dto.pipe';

@Component({
  selector: 'app-time-board',
  templateUrl: './time-board.component.html',
  styleUrls: ['./time-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButton,
    TimeBoardListComponent,
    MatCheckbox,
    FormsModule,
    CopyClickDirective,
    TimeDtoPipe,
  ],
})
export class TimeBoardComponent {
  private timeService = inject(TimeService);
  private store = inject<Store<State>>(Store);
  private keyListenerService = inject(KeyListenerService);
  private taskMapService = inject(TaskMapService);

  list = this.store.selectSignal(fromRoot.getList);
  calculated = this.store.selectSignal(fromRoot.getCalcList);
  setting = signal(this.timeService.getSetting());
  totalMinutes = computed(() =>
    this.list().reduce((total, item) => total + this.timeService.getTime(item), 0)
  );
  totalTime = computed(() => this.timeService.getStringHourMinute(this.totalMinutes()));
  totalHours = computed(() => (this.totalMinutes() / 60).toFixed(2));

  constructor() {
    this.keyListenerService
      .listener(['ControlLeft', 'KeyZ'])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.undo());
    this.keyListenerService
      .listener(['ControlLeft', 'KeyQ'])
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.reCalc());
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

  genItem(): TimeItem {
    return TimeService.genItem();
  }

  reCalc(): void {
    this.store.dispatch(
      new actions.SetCalculationList(
        this.timeService.calcTime(
          this.list(),
          this.setting(),
          this.taskMapService.taskMap()
        )
      )
    );
  }

  changeSort(event: MatCheckboxChange): void {
    this.updateSetting({ sort: event.checked });
  }

  changeGroup(event: MatCheckboxChange): void {
    this.updateSetting({ groupByDescription: event.checked });
  }

  changeTimeReorder(event: MatCheckboxChange): void {
    this.updateSetting({ timeReorder: event.checked });
  }

  private updateSetting(patch: Partial<Setting>): void {
    this.setting.update((setting) => ({ ...setting, ...patch }));
    this.timeService.saveSetting(this.setting());
  }

  getHourAndMinutes(minutes: number): string {
    return this.timeService.getStringHourMinute(minutes);
  }

  delete(index: number): void {
    this.store.dispatch(new actions.DeleteCalculationItem(index));
  }
}
