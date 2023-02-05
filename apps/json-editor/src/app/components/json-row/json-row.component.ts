import {
  ChangeDetectionStrategy,
  Component, EventEmitter,
  Input, OnChanges, Output, SimpleChanges,
} from '@angular/core';
import { JsonData } from "../../interface";

enum FieldType {
  object = 'object',
  simple = 'simple',
}

type Value = string | number;

interface Field {
  key: string;
  type: FieldType;
  value: Value;
}

const MAX_PREVIEW_LENGTH = 20;

@Component({
  selector: 'je-json-row',
  templateUrl: './json-row.component.html',
  styleUrls: ['./json-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonRowComponent implements OnChanges {
  @Input() key: string;
  @Input() data: JsonData;
  @Input() selected: string;

  @Output() selectKey = new EventEmitter<string>();

  fields: Field[];
  FieldType = FieldType;

  ngOnChanges({ data }: SimpleChanges): void {
    if (data && this.data) {
      this.fields = this.prepareFields();
    }
  }

  onValueClick(key: string, type: FieldType): void {
    if (type === FieldType.simple) {
      return;
    }

    this.selectKey.emit(key);
  }

  private prepareFields(): Field[] {
    const keys = Object.keys(this.data);
    const fields: Field[] = [];
    keys.forEach(key => {
      const type = typeof this.data[key] === "object" ? FieldType.object : FieldType.simple;
      fields.push({
        key,
        type,
        value: this.prepareValue(key, type)
      })
    })

    return fields;
  }

  private prepareValue(key: string, type: FieldType): Value {
    if (type === FieldType.simple) {
      return this.data[key] as Value;
    }

    return JSON.stringify(this.data[key]).substring(0, MAX_PREVIEW_LENGTH);
  }
}
