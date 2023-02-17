import { Item } from '@filecab/models/base';
import { MetaData } from '@filecab/models/meta-data';
import { Anime } from '@filecab/models/anime';
import { Film } from '@filecab/models/films';
import { Tag } from './tag';
import { LibraryItem } from '@filecab/models';

export interface LibraryItemOld<T extends Item> extends MetaData {
  item: T;
}

export interface ISchema {
  func?: string;
  title?: string;
  type: string;
}

export type ItemType = Anime | Film;

export interface UserData {
  id: number;
  email: string;
  token: string;
}

export interface LibrarySettings {
  user?: UserData
  enableSync?: boolean;
}

export interface Library {
  tags: Tag[];
  data: Record<string, LibraryItem[]>;
  lastTimeUpdate: number;
}

export interface LibraryOld {
  tags: Tag[];
  data: Record<string, LibraryItemOld<ItemType>[]>;
  lastTimeUpdate: number;
}
