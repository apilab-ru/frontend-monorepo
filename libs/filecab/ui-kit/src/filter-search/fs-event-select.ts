import { SearchValue } from "./interface";

export interface FSEventSelectValue extends Omit<SearchValue, 'key'> {
  key: string;
}