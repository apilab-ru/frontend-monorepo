import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FSDropdownValue } from "../../interface";
import { makeStore } from "@store";
import { Observable, combineLatest, map } from "rxjs";
import { getStreamValue } from "@store/rxjs/get-stream-value";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { FSEventSelectValue } from "../../fs-event-select";

const store = {
  search: '',
  list: [] as FSDropdownValue[],
  selected: null as null | string,
  index: 0,
  positive: true,
}

@UntilDestroy()
@Component({
  selector: 'filecab-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent implements OnChanges, OnInit {
  @Input() list: FSDropdownValue[];
  @Input() selected: string;
  @Input() search: string;

  @Output() selectValue = new EventEmitter<FSEventSelectValue>();
  @Output() selectedChange = new EventEmitter<string | null>();

  list$: Observable<FSDropdownValue[]>;
  selected$: Observable<string | null>;
  index$: Observable<number>;
  positive$: Observable<boolean>;

  private store = makeStore(store);

  ngOnChanges({ list, selected, search }: SimpleChanges): void {
    if (list && this.list) {
      this.store.update({ list: this.list });
    }

    if (selected) {
      this.store.update({ selected: this.selected });
    }

    if (search) {
      this.store.update({ search: this.search });
    }
  }

  ngOnInit(): void {
    this.selected$ = this.store.selected.asObservable();
    const rawList$ = combineLatest([
      this.selected$,
      this.store.list
    ]).pipe(
      map(([selected, list]) => !selected
        ? list
        : [
          { key: null, name: 'Назад' },
          ...list.find(it => it.key === selected)?.values || [],
        ])
    );

    function stringInclude(source: string, search: string): boolean {
      return source.toLocaleLowerCase().includes(search)
    }

    this.list$ = combineLatest([
      rawList$,
      this.store.search,
    ]).pipe(
      map(([list, search]) => {
        if (!search) {
          return list;
        }

        const filterSt = search.toLocaleLowerCase().trim();

        return list.filter(item => {
          const filterFn = item.filterFn ? item.filterFn : stringInclude.bind(null, item.name)
          return !item.key || filterFn(filterSt);
        })
      }),
    );

    this.list$.pipe(untilDestroyed(this)).subscribe(list => this.handleChangeIndex(
      this.store.index.value,
      list.length,
    ));

    this.index$ = this.store.index.asObservable();
    this.positive$ = this.store.positive.asObservable();
  }

  onSelectKey(item: FSDropdownValue, negative?: boolean): void {
    const key = item?.key || null;

    if (!key || item.values) {
      this.store.selected.next(key);
      this.selectedChange.next(key);
    } else {
      this.selectValue.next({
        key: this.store.selected.value || item.key!,
        value: this.store.selected.value ? item.key! : '',
        negative: negative ?? !this.store.positive.value,
      })
    }
  }

  selectCurrent(): void {
    const list = getStreamValue(this.list$, []);
    const index = this.store.index.value;

    this.onSelectKey(list[index]);
  }

  setIndex(index: number): void {
    this.store.index.next(index);
  }

  changeIndex(diff: number): void {
    const index = this.store.index.value;

    if (diff === 0) {
      return this.store.index.next(0);
    }

    let newIndex = index + diff;
    const list = getStreamValue(this.list$, []);

    this.handleChangeIndex(newIndex, list.length);
  }

  togglePositive(): void {
    this.store.positive.next(
      !this.store.positive.value
    )
  }

  private handleChangeIndex(newIndex: number, listLength: number): void {
    if (newIndex < 0) {
      newIndex = listLength - 1;
    }

    if (newIndex > (listLength - 1)) {
      newIndex = 0;
    }

    this.store.index.next(newIndex);
  }
}
