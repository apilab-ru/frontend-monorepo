import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TimeItem } from '../../models/time-item';
import { TimeService } from '../../services/time.service';

@Component({
  selector: 'app-time-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent {
  @Input() item: TimeItem;

  @Output() deleteItem = new EventEmitter();
  @Output() updateItem = new EventEmitter<TimeItem>();

  constructor(private timeService: TimeService) {
  }

  delete(): void {
    this.deleteItem.emit();
  }

  getTime(): number {
    return this.timeService.getTime(this.item);
  }

  onChange(): void {
    this.updateItem.emit(this.item);
  }

}
