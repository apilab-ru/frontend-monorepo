import { RecordSubject } from "../../../../../libs/store/src";

export class Reducer<T> {
  constructor(protected store: RecordSubject<T>) {
  }
}
