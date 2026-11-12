import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GroupConfig, LogsUserRawData } from '../../interfaces';

@Component({
  selector: 'app-controls',
  imports: [FormsModule, MatCheckboxModule],
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsComponent {
  data = model.required<LogsUserRawData>();

  updateText(field: 'logs' | 'rules', value: string): void {
    this.data.update((data) => ({ ...data, [field]: value }));
  }

  updateGrouping(field: keyof GroupConfig, value: boolean): void {
    this.data.update((data) => ({
      ...data,
      groupConfig: { ...data.groupConfig, [field]: value },
    }));
  }
}
