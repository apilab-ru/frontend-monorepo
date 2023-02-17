import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter, forwardRef,
  Input,
  Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'filecab-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ProgressComponent), multi: true },
  ],
})
export class ProgressComponent implements ControlValueAccessor {
  @Input() value = 0;
  @Input() total: number;

  @Output() valueChange = new EventEmitter<number>();

  private onChange?: (value: number) => void;
  private onTouched?: () => void;

  writeValue(value: number): void {
    this.value = value;
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onUpdate(current: number): void {
    this.value = current;
    this.valueChange.emit(current);

    if (this.onChange) {
      this.onChange(current);
    }

    if (this.onTouched) {
      this.onTouched();
    }
  }
}
