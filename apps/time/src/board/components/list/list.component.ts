import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { TimeItem } from '../../models/time-item';
import { UpdateEvent } from '../../models/update-event';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'app-time-board-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ItemComponent],
})
export class TimeBoardListComponent {
  list = input<TimeItem[]>([]);

  deleteItem = output<number>();
  updateItem = output<UpdateEvent<TimeItem>>();

  onDeleteItem(i: number): void {
    this.deleteItem.emit(i);
  }

  onUpdateItem(index: number, item: TimeItem): void {
    this.updateItem.emit({
      index,
      item,
    });
  }
}
