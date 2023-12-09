import { RecordSubject } from "@apilab/store";

export class Reducer<T> {
  constructor(protected store: RecordSubject<T>) {
  }
}
