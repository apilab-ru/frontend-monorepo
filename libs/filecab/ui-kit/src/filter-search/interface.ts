export type FilterSearchData = SearchValue[];

export interface SearchValue {
  key: string;
  value: string | number;
  negative?: boolean;
}

export interface FSDropdownValue {
  name: string;
  key: string | null;
  values?: FSDropdownValue[];
  custom?: boolean;
  unique?: boolean;
  filterFn?: (search: string) => boolean;
}