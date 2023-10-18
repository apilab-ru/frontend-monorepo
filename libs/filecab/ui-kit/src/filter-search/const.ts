import { STATUS_LIST } from "@filecab/models/status";
import { FilterSearchData, FSDropdownValue, SearchValue } from "./interface";

/*export const SEARCH_KEYS = {
  genres: {
    name: 'жанр',
    list: [] as any[],
  },
  years: {
    name: 'года',
  },
  ratingFrom: {
    name: 'рейтингОт',
  },
  ratingTo: {
    name: 'рейтингДо',
  },
  status: {
    name: 'статус',
    list: STATUS_LIST.map(item => ({ name: item.name, id: item.status })),
  },
};*/


export enum SearchKeys {
  search = 'search',
  genres = 'genres',
  years = 'years',
  tags = 'tags',
  ratingFrom = 'ratingFrom',
  ratingTo = 'ratingTo',
  status = 'status',
  star = 'star'
}

export const BASE_SEARCH_DATA: FilterSearchData = [];

export const BASE_SEARCH_VALUES: FSDropdownValue[] = [
  {
    key: 'status',
    name: 'Статус',
    values: STATUS_LIST
      .filter(it => !!it.status)
      .map(item => ({ name: item.name, key: item.status! }))
  },
  {
    key: 'search',
    name: 'Поиск',
    custom: true,
    unique: true,
    filterFn: () => true,
  },
];

export const LOCAL_SEARCH_VALUES: FSDropdownValue[] = [
  ...BASE_SEARCH_VALUES,
  {
    key: 'star',
    name: 'Оценка',
    custom: true,
    filterFn: (value: string) => !value || !isNaN(parseInt(value)),
  }
];