import { OrderField } from "@filecab/ui-kit/list/models/interface";

export const ORDER_DEFAULT = 'dateAd';

export const LOCAL_ORDER_FIELDS: OrderField[] = [
  {
    key: 'dateAd',
    name: 'Дата добавления',
  },
  {
    key: 'dateChange',
    name: 'Дата изменения',
  },
  {
    key: 'item.title',
    name: 'Название',
  },
  {
    key: 'item.year',
    name: 'Год',
  },
  {
    key: 'star',
    name: 'Оценка',
  },
  {
    key: 'status',
    name: 'Статус',
  },
];