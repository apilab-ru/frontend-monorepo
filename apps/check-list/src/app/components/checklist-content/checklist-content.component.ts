import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { GroupPoints } from '../../interface';

export interface ChecklistItemToggle {
  key: string;
  checked: boolean;
}

@Component({
  selector: 'app-checklist-content',
  templateUrl: './checklist-content.component.html',
  styleUrls: ['./checklist-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistContentComponent {
  points = input.required<GroupPoints[]>();
  checked = input.required<Set<string>>();
  loading = input(false);
  hasError = input(false);

  itemToggle = output<ChecklistItemToggle>();

  skeletonGroups = [0, 1];
  skeletonItems = [0, 1, 2, 3];

  onItemChange(key: string, event: Event): void {
    this.itemToggle.emit({ key, checked: (event.target as HTMLInputElement).checked });
  }
}
