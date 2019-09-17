import { Injectable } from '@angular/core';
import { TimeDto } from '../models/time';
import { TimeItem } from '../models/time-item';
import { Calc } from '../models/calc';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  private readonly minutesInHour = 60;

  getStringTime(time: TimeDto): string {
    if (!time) {
      return '';
    }
    return `${time.hour}:${time.minute.toString().padStart(2, '0')}`;
  }

  getTimeFromString(value: string): TimeDto {
    const [hours, minutes] = value.split(':');

    if (!hours && hours !== '0' && !minutes) {
      return null;
    }

    return {
      hour: +hours,
      minute: +minutes
    };
  }

  getStringHourMinute(minutes: number): string {
    const hour = Math.floor(minutes / 60).toString().padStart(2, '0');
    const min = (minutes - (+hour * 60)).toString().padStart(2, '0');
    return `${hour}:${min}`;
  }

  getNow(): TimeDto {
    const time = new Date();
    return {
      hour: time.getHours(),
      minute: time.getMinutes()
    };
  }

  getMinutes(time: TimeDto): number {
    if (!time) {
      return 0;
    }

    return time.hour * this.minutesInHour + time.minute;
  }

  getTime(item: TimeItem): number {
    const from = this.getMinutes(item.from);
    let to = this.getMinutes(item.to);

    if (to === 0) {
      to = this.getMinutes(this.getNow());
    }

    if (isNaN(from) || isNaN(to)) {
      return 0;
    }

    if (to < from) {
      to += 24 * this.minutesInHour;
    }

    const div = to - from;

    return (div > 0) ? div : 0;
  }

  getList(): TimeItem[] {
    const data = localStorage['today'];
    let list = [];
    try {
      list = JSON.parse(data);
    } catch (e) {
    }

    if (!list || !list.length) {
      list = [this.genItem()];
    }

    return list;
  }

  genItem(): TimeItem {
    return {
      from: this.getNow(),
      to: null,
      task: '',
      description: null
    };
  }

  calcTime(timeList: TimeItem[]): Calc[] {
    const list: Calc[] = [];

    timeList.forEach(item => {
      const index = list.findIndex(it => it.task === item.task);
      if (index !== -1) {
        list[index].time += this.getTime(item);
        if (list[index].description.indexOf(item.description) === -1) {
          list[index].description += '; ' + item.description;
        }
      } else {
        list.push({
          task: item.task,
          time: this.getTime(item),
          description: item.description
        });
      }
    });

    list.sort((a, b) => {
      return a.task === b.task ? 0 :
        (a.task > b.task ? 1 : -1);
    });

    return list;
  }

}
