import { LibraryItemV2 } from "@filecab/models/library";

export interface DropdownItem {
  key: string | number;
  name: string | number;
}

export interface OrderField {
  key: keyof LibraryItemV2 | string;
  name: string;
}
