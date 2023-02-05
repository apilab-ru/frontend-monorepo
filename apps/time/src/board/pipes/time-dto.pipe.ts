import { Pipe, PipeTransform } from '@angular/core';
import { TimeService } from '../services/time.service';

@Pipe({
  name: 'timeDto'
})
export class TimeDtoPipe implements PipeTransform {

  constructor(private timeService: TimeService) {
  }

  transform(minutes: number): string {
    return this.timeService.getStringHourMinute(minutes);
  }

}
