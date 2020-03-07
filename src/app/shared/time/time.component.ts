import { Component, forwardRef } from '@angular/core';
import { TimeDto } from '../../models/time';
import { TimeService } from '@api/services/time.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TimeComponent), multi: true },
  ]
})
export class TimeComponent implements ControlValueAccessor {

  value: TimeDto;
  valueString = '';
  mask = '00:00';

  private propagateChange: (value: TimeDto) => void = (arg: TimeDto) => {};

  constructor(private timeService: TimeService) { }

  updateValue(value: string): void {
    this.valueString = value;
    const time = this.timeService.getTimeFromString(value);
    if (JSON.stringify(time) !== JSON.stringify(this.value)) {
      this.value = time;
      this.propagateChange(time);
    }
  }

  writeValue(value: TimeDto): void {
    this.value = value;
    this.valueString = this.timeService.getStringTime(value);
  }

  registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn): void {
  }

  setNow(): void {
    this.value = this.timeService.getNow();
    this.propagateChange(this.value);
    this.valueString = this.timeService.getStringTime(this.value);
  }

}
