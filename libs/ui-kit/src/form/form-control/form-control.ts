import {
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  NgControl
} from "@angular/forms";
import {
  AfterViewInit,
  Directive,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import { ChangeCallback, TouchCallback } from './interface';
import { map } from "rxjs/operators";
import { BehaviorSubject, merge, Observable, Subject } from "rxjs";

@Directive()
export abstract class UiFormControl<T> implements ControlValueAccessor, OnChanges, AfterViewInit {
  @Input() name: string;
  @Input() value: T;

  @Output() valueChange = new EventEmitter<T>();

  control: FormControl<T>;
  id = 'input';

  value$ = new BehaviorSubject<T>(undefined as T);
  error$: Observable<string | null>;

  @ViewChild(FormControlDirective, { static: true }) protected formControlDirective?: FormControlDirective;
  protected changeCallback?: ChangeCallback<T>;
  protected touchCallback?: TouchCallback;
  protected refresh$ = new Subject<void>();

  constructor(
    protected injector: Injector,
  ) {
  }

  ngOnChanges({ name, value }: SimpleChanges): void {
    if (value) {
      this.writeValue(this.value);
    }

    if (name) {
      this.id = this.name + Math.random();
    }
  }

  ngAfterViewInit(): void {
    const ngControl = this.injector.get(NgControl, null);

    this.control = ngControl?.control as FormControl || new FormControl<T>(undefined as unknown as T);
    this.name = this.name || ngControl?.name + '' || 'input';

    this.id = this.name + Math.random();

    this.error$ = merge(
      this.control.statusChanges,
      this.refresh$,
    ).pipe(
      map(() => {
        if (!this.control.touched || !this.control.errors) {
          return null;
        }

        return Object.entries(this.control.errors || {}).map(([key, value]) => {
          if (typeof value === 'string') {
            return value;
          }

          return key;
        }).join(',');
      })
    )
  }

  getValue(): T {
    return this.value$.value;
  }

  updateValue(value: T): void {
    this.value$.next(value);

    this.valueChange.emit(value);

    if (this.changeCallback) {
      this.changeCallback(value);
    }
  }

  writeValue(value: T): void {
    this.value$.next(value);
  }

  touch(): void {
    if (this.touchCallback) {
      this.touchCallback(true);
    }

    this.refresh$.next();
  }

  registerOnChange(fn: ChangeCallback<T>): void {
    this.changeCallback = fn;
  }

  registerOnTouched(fn: TouchCallback): void {
    this.touchCallback = fn;
  }
}