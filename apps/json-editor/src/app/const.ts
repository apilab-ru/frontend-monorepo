import { DbConfig } from '@store';

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
