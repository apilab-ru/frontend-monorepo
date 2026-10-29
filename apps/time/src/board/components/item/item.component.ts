import { ChangeDetectionStrategy, Component, input, output, inject } from '@angular/core';
import { TimeItem } from '../../models/time-item';
import { TimeService } from '../../services/time.service';
import { TimeComponent } from '../time/time.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-time-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimeComponent, FormsModule],
})
export class ItemComponent {
  private timeService = inject(TimeService);

  item = input.required<TimeItem>();

  deleteItem = output<void>();
  updateItem = output<TimeItem>();

  delete(): void {
    this.deleteItem.emit();
  }

  getTime(): number {
    return this.timeService.getTime(this.item());
  }

  onChange<Key extends keyof TimeItem>(value: TimeItem[Key], field: Key): void {
    const result = {
      ...this.item(),
      [field]: value,
    };
    this.updateItem.emit(result);
  }
}
