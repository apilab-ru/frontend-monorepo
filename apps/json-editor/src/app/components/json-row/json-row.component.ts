import {
  ChangeDetectionStrategy,
  Component, EventEmitter,
  Input, OnChanges, OnInit, Output, SimpleChanges,
} from '@angular/core';
import { JsonData } from "../../interface";
import { FormControl, FormGroup } from "@angular/forms";
import { combineLatest, map, Observable, ReplaySubject, startWith } from "rxjs";

enum FieldType {
  object = 'object',
  simple = 'simple',
}

type Value = string | number;

interface Field {
  key: string;
  type: FieldType;
  value: Value;
  fullValue: string;
}

const MAX_PREVIEW_LENGTH = 20;

@Component({
  selector: 'je-json-row',
  templateUrl: './json-row.component.html',
  styleUrls: ['./json-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonRowComponent implements OnChanges, OnInit {
  @Input() key: string;
  @Input() data: JsonData;
  @Input() selected: string;

  @Output() selectKey = new EventEmitter<string>();

  FieldType = FieldType;
  formGroup = this.initForm();
  fields$: Observable<Field[]>;

  private fields = new ReplaySubject<Field[]>(1);

  ngOnInit(): void {
    this.fields$ = combineLatest([
      this.fields,
      this.formGroup.controls.search.valueChanges.pipe(
        startWith('')
      )
    ]).pipe(
      map(([fields, search]) => {
        if (!search) {
          return fields;
        }

        return fields.filter(item => item.fullValue.includes(search));
      })
    );
  }

  ngOnChanges({ data }: SimpleChanges): void {
    if (data && this.data) {
      this.fields.next(this.prepareFields());
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
        value: this.prepareValue(key, type),
        fullValue: JSON.stringify(this.data[key])
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

  private initForm(): FormGroup {
    return new FormGroup({
      search: new FormControl<string>('')
    })
  }
}
