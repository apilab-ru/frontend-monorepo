import type { Signal } from '@angular/core';
import { FieldType } from '../../interface';
import { TYPE_ICONS } from '../../const';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import type { JsonData, UpdateValueEvent, Value, Field } from '../../interface';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'je-json-row',
  templateUrl: './json-row.component.html',
  styleUrls: ['./json-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
})
export class JsonRowComponent {
  key = input('');
  data = input<JsonData | null>(null);
  selected = input<string | null>(null);

  inspectKey = output<string>();
  updateValue = output<UpdateValueEvent>();

  FieldType = FieldType;
  formGroup = new FormGroup({
    search: new FormControl('', { nonNullable: true })
  });
  isArray = computed(() => Array.isArray(this.data()));
  fields = this.createFields();
  filteredFields = this.createFilteredFields();

  private search = this.createSearch();

  onUpdateValue(field: Field, value: Value): void {
    this.updateValue.emit({ key: field.key, value });
  }

  private createFields(): Signal<Field[]> {
    return computed(() => {
      const data = this.data();

      if (data === null || typeof data !== 'object') return [];

      return Object.entries(data).map(([key, value]): Field => {
        const kind =
          value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
        const container = value !== null && typeof value === 'object';
        const count = container ? Object.keys(value).length : 0;
        const unit = Array.isArray(value) ? 'item' : 'field';

        return {
          key,
          type: container ? FieldType.object : FieldType.simple,
          kind,
          icon: TYPE_ICONS[kind] ?? '·',
          value: container
            ? `${count} ${unit}${count === 1 ? '' : 's'}`
            : (value as Value),
          fullValue: JSON.stringify(value),
        };
      });
    });
  }

  private createFilteredFields(): Signal<Field[]> {
    return computed(() => {
      const query = this.search().toLowerCase();

      return this.fields().filter((item) =>
        `${item.key} ${item.fullValue}`.toLowerCase().includes(query)
      );
    });
  }

  private createSearch(): Signal<string> {
    return toSignal(this.formGroup.controls.search.valueChanges, {
      initialValue: '',
    });
  }
}
