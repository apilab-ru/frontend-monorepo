import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges, ViewChild
} from '@angular/core';
import { FilterSearchData, FSDropdownValue, SearchValue } from "../../interface";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BehaviorSubject, filter, Observable, skip } from "rxjs";
import isEqual from "lodash-es/isEqual";
import { BASE_SEARCH_DATA } from "../../const";
import { FSEventSelectValue } from "../../fs-event-select";
import { InputComponent } from "../input/input.component";

@UntilDestroy()
@Component({
  selector: 'lib-filter-search',
  templateUrl: './filter-search.component.html',
  styleUrls: ['./filter-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterSearchComponent implements OnInit, OnChanges {
  @Input() list: FSDropdownValue[];
  @Input() value: FilterSearchData;
  @Output() valueChanges = new EventEmitter<FilterSearchData>();

  private store = new BehaviorSubject<FilterSearchData>(BASE_SEARCH_DATA);

  preset: Record<string, FSDropdownValue> = {};
  options$: Observable<SearchValue[]>;

  @ViewChild(InputComponent, { static: true }) private inputComponent: InputComponent;

  ngOnChanges({ value, list }: SimpleChanges): void {
    if (value && this.value) {
      this.store.next(this.value);
    }

    if (list && this.list) {
      this.preset = {};
      this.list.forEach(item => {
        this.preset[item.key!] = item;
      })
    }
  }

  ngOnInit(): void {
    this.store.pipe(
      skip(1),
      filter(value => !isEqual(value, this.value)),
      untilDestroyed(this)
    ).subscribe(value => {
      this.valueChanges.emit(value);
    })

    this.options$ = this.store.asObservable();
  }

  onRemoveChip(index: number): void {
    this.store.next(
      this.store.value.filter((_, i) => i !== index)
    )
  }

  onEditChip(index: number, item: SearchValue): void {
    this.onRemoveChip(index);

    this.inputComponent.onSelectedChange(item.key);
    this.inputComponent.focus();
  }

  onAddValue(item: FSEventSelectValue): void {
    this.handleAddOption(item as SearchValue);
  }

  private handleAddOption(value: SearchValue): void {
    const options = this.store.value || [];
    this.store.next([
      ...options.filter(it => {
        if (it.key !== value.key) {
          return true;
        }

        const preset = this.preset[it.key];
        if (preset.unique || it.value === value.value) {
          return false;
        }

        return true;
      }),
      value,
    ])
  }
}
