import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, debounceTime, defer, of, switchMap } from 'rxjs';
import { AnalyzerService } from '../../services/analyzer.service';
import { UserDataService } from '../../services/user-data.service';
import { LogDetail } from '../../interfaces';
import { ControlsComponent } from '../controls/controls.component';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-page',
  imports: [ControlsComponent, ChartComponent],
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent {
  userData = inject(UserDataService);
  logs: Signal<LogDetail[]>;

  private analyzer = inject(AnalyzerService);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.logs = toSignal(toObservable(this.userData.data).pipe(
      debounceTime(200),
      switchMap(({ logs, rules, groupConfig }) => defer(() =>
        this.analyzer.groupLogs(
          this.analyzer.convertLogs(JSON.parse(logs)),
          this.analyzer.parserRules(rules.split('\n')),
          groupConfig,
        ),
      ).pipe(catchError((error) => {
        this.snackBar.open(String(error), 'Dismiss');

        return of([]);
      }))),
    ), { initialValue: [] });
  }
}
