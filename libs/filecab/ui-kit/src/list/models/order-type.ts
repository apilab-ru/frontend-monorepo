import { DropdownItem } from "./interface";

export enum OrderType {
  asc = 'asc',
  desc = 'desc',
}

export const DROPDOWN_LIST: DropdownItem[] = [
  {
    key: OrderType.asc,
    name: 'ASC'
  },
  {
    key: OrderType.desc,
    name: 'DESC'
  }
];