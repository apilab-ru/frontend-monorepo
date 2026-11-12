import { ChangeDetectionStrategy, Component, computed, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconComponent } from '../icon.component';
import { DEFAULT_DATA } from '../../const';
import { GroupConfig, LogsUserRawData } from '../../interfaces';

@Component({
  selector: 'app-controls',
  imports: [FormsModule, MatTooltipModule, IconComponent],
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsComponent {
  data = model.required<LogsUserRawData>();

  rowCount = computed(() => this.countRows());
  groupingOptions: { field: keyof GroupConfig; label: string; help: string }[] = [
    { field: 'groupByTask', label: 'Group by task-key', help: 'Combine entries with the same issue key.' },
    { field: 'groupByComment', label: 'Group by comment', help: 'Combine matching comments, ignoring case and outer spaces.' },
    { field: 'groupByRules', label: 'Group by rules', help: 'Group entries using the first matching rule below.' },
  ];

  loadExample(): void {
    this.data.set({ ...DEFAULT_DATA, groupConfig: { ...DEFAULT_DATA.groupConfig } });
  }

  clearLogs(): void {
    this.updateText('logs', '[]');
  }

  updateText(field: 'logs' | 'rules', value: string): void {
    this.data.update((data) => ({ ...data, [field]: value }));
  }

  updateGrouping(field: keyof GroupConfig, value: boolean): void {
    this.data.update((data) => ({
      ...data,
      groupConfig: { ...data.groupConfig, [field]: value },
    }));
  }
  private countRows(): number {
    try {
      const rows = JSON.parse(this.data().logs);

      return Array.isArray(rows) ? rows.length : 0;
    } catch {
      return 0;
    }
  }
}
