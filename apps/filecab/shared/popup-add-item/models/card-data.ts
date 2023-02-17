import { MetaData } from '@filecab/models/meta-data';

export interface CardData extends Omit<MetaData, 'founded'> {
  name: string;
  type: string;
}
