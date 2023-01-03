import { RecordSubject } from '../store/helpers';

export class Reducer<T> {
  constructor(protected store: RecordSubject<T>) {
  }
}
