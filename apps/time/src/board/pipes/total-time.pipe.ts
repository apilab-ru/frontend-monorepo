import { Pipe, PipeTransform } from '@angular/core';
import { TimeItem } from '../models/time-item';
import { TimeService } from '../services/time.service';

@Pipe({
  name: 'totalTime'
})
export class TotalTimePipe implements PipeTransform {

  constructor(
    private timeService: TimeService,
  ) {
  }

  transform(list: TimeItem[]): string {
    const minutes = list.reduce((prev, next) => this.timeService.getTime(next) + prev, 0);
    return this.timeService.getStringHourMinute(minutes);
  }

}
