import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FSDropdownValue, SearchValue } from "../../interface";

@Component({
  selector: 'filecab-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent {
  @Input() item: SearchValue;
  @Input() preset: FSDropdownValue;

  @Output() removeChip = new EventEmitter<void>();

  getValue(item: SearchValue, preset: FSDropdownValue): string {
    const prefix = item.negative ? '!' : ''

    if (preset.values) {
      return prefix + (preset.values.find(it => it.key === item.value)?.name || item.value as string);
    }

    return prefix + item.value as string;
  }
}
