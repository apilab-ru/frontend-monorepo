import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TimeItem } from '../../models/time-item';
import { UpdateEvent } from '../../models/update-event';

@Component({
  selector: 'app-time-board-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class TimeBoardListComponent {
  @Input() list: TimeItem[] = [];

  @Output() deleteItem = new EventEmitter<number>();
  @Output() updateItem = new EventEmitter<UpdateEvent<TimeItem>>();

  onDeleteItem(i: number): void {
    this.deleteItem.emit(i);
  }

  onUpdateItem(index: number, item: TimeItem): void {
    this.updateItem.emit({
      index,
      item
    });
  }

  trackByIndex(index: number): number {
    return index;
  }
}
