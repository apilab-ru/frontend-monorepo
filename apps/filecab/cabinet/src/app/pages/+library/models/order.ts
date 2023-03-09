import { OrderField } from "@filecab/ui-kit/list/models/interface";
import { OrderType } from "@filecab/ui-kit/list/models/order-type";

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

export interface OrderParams {
  limit: number;
  orderType: OrderType;
  orderField: string;
}