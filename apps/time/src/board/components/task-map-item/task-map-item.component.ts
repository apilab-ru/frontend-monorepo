import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TaskMapItem } from '../../models/task-map-item';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-map-item',
  templateUrl: './task-map-item.component.html',
  styleUrls: ['./task-map-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
})
export class TaskMapItemComponent {
  item = input.required<TaskMapItem>();

  deleteItem = output<void>();
  updateItem = output<TaskMapItem>();

  public onChange(key: keyof TaskMapItem, value: string): void {
    const item = {
      ...this.item(),
      [key]: value,
    };

    this.updateItem.emit(item);
  }
}
