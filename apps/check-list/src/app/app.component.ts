import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCheckbox } from '@angular/material/checkbox';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  imports: [MatCheckbox],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private dataService = inject(DataService);

  points = toSignal(this.dataService.loadPoints(), { initialValue: [] });
}
