import { DbConfig } from '@store';
import type { JsonFile } from './interface';

export const PATH_SEPARATOR = '///';

export const DB_STORE_CONFIG: DbConfig = {
  name: 'jsonEditor',
  version: 3,
  objects: [
    {
      name: 'jsonFiles',
      options: {
        keyPath: 'id',
        autoIncrement: true,
      },
    },
  ],
};

export const TYPE_ICONS: Record<string, string> = {
  object: '◇',
  array: '[ ]',
  string: '“',
  number: '#',
  boolean: '◉',
  null: '∅',
};

export const STORE = {
  files: [] as JsonFile[],
};
