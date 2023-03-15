import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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

  getValue(item: SearchValue, preset: FSDropdownValue): string {
    if (preset.values) {
      return preset.values.find(it => it.key === item.value)?.name || item.value as string;
    }

    return item.value as string;
  }
}
