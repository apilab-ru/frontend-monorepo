import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskMapItem } from '../../models/task-map-item';

@Component({
  selector: 'app-task-map-item',
  templateUrl: './task-map-item.component.html',
  styleUrls: ['./task-map-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskMapItemComponent {
  @Input() item: TaskMapItem;

  @Output() deleteItem = new EventEmitter<void>();
  @Output() updateItem = new EventEmitter<TaskMapItem>();

  public onChange(): void {
    this.updateItem.emit(this.item);
  }
}
