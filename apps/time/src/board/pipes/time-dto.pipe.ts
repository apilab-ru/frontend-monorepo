import { Pipe, PipeTransform, inject } from '@angular/core';
import { TimeService } from '../services/time.service';

@Pipe({ name: 'timeDto' })
export class TimeDtoPipe implements PipeTransform {
  private timeService = inject(TimeService);

  transform(minutes: number): string {
    return this.timeService.getStringHourMinute(minutes);
  }
}
