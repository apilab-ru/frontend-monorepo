import { TimeDto } from './time';

export interface TimeItem {
  from: TimeDto;
  to: TimeDto;
  task: string;
  description: string;
}
