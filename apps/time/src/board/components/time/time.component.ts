import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  signal,
  inject,
} from '@angular/core';
import { TimeDto } from '../../models/time';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { TimeService } from '../../services/time.service';
import { NgxMaskDirective } from 'ngx-mask';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeComponent),
      multi: true,
    },
  ],
  imports: [NgxMaskDirective, FormsModule, MatIcon],
})
export class TimeComponent implements ControlValueAccessor {
  private timeService = inject(TimeService);

  value: TimeDto;
  valueString = signal('');
  mask = '00:00';

  private propagateTouched: () => void = () => undefined;
  private propagateChange: (value: TimeDto) => void = () => undefined;

  updateValue(value: string): void {
    this.valueString.set(value);
    const time = this.timeService.getTimeFromString(value);

    if (JSON.stringify(time) !== JSON.stringify(this.value)) {
      this.value = time;
      this.propagateChange(time);
    }
  }

  writeValue(value: TimeDto): void {
    this.value = value;
    this.valueString.set(this.timeService.getStringTime(value));
  }

  registerOnChange(fn: (value: TimeDto) => void): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.propagateTouched = fn;
  }

  onBlur(): void {
    this.propagateTouched();
  }

  setNow(): void {
    this.value = TimeService.getNow();
    this.propagateChange(this.value);
    this.propagateTouched();
    this.valueString.set(this.timeService.getStringTime(this.value));
  }
}
