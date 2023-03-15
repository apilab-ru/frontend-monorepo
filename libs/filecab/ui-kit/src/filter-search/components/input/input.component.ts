import {
  ChangeDetectionStrategy,
  Component, EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl } from "@angular/forms";
import { combineLatest, delay, map, merge, Observable, of, Subject, switchMap } from "rxjs";
import { FSDropdownValue } from "../../interface";
import { DropdownComponent } from "../dropdown/dropdown.component";

import { makeStore } from "@store";
import { filterUndefined } from "@store/rxjs/filter-undefined";
import { FSEventSelectValue } from "../../fs-event-select";

const store = {
  selected: null as string | null,
  isOpen: false,
  list: undefined as undefined | FSDropdownValue[],
}

@Component({
  selector: 'filecab-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent implements OnInit, OnChanges {
  @Input() list: FSDropdownValue[];
  @Output() selectValue = new EventEmitter<FSEventSelectValue>();

  inputControl = new FormControl<string>('');

  isOpen$: Observable<boolean>;
  selected$: Observable<FSDropdownValue | null>;

  private store = makeStore(store);
  private forceClose = new Subject<void>();

  @ViewChild(DropdownComponent) private dropdown: DropdownComponent;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.list) {
      this.store.list.next(this.list);
    }
  }

  ngOnInit(): void {
    const isOpen$ = this.store.isOpen.pipe(
      switchMap(isOpen => isOpen ? of(true) : of(false).pipe(
        delay(300),
      ))
    )

    this.isOpen$ = merge(
      isOpen$,
      this.forceClose.pipe(map(() => false)),
    )

    this.selected$ = combineLatest([
      this.store.selected,
      this.store.list.pipe(filterUndefined())
    ]).pipe(
      map(([selected, list]) => !selected ? null : list.find(it => it.key === selected) || null)
    );
  }

  focusOut(): void {
    this.store.isOpen.next(false);
  }

  focusIn(): void {
    this.store.isOpen.next(true);
  }

  onKeyDown(): void {
    this.dropdown.changeIndex(+1);
  }

  onKeyUp(): void {
    this.dropdown.changeIndex(-1);
  }

  onSelect(): void {
    this.dropdown.selectCurrent();
  }

  togglePositive(): void {
    this.dropdown.togglePositive();
  }

  onSelectValue(event: FSEventSelectValue): void {
    const value = event.value || this.inputControl.value;

    if (!value) {
      return;
    }

    this.inputControl.patchValue('');

    this.selectValue.next({
      ...event,
      value,
    });
  }

  onSelectedChange(key: string | null): void {
    this.store.selected.next(key);
  }
}
