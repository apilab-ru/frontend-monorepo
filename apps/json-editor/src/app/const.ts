import { IDbConfig } from '@store';

export const DB_STORE_CONFIG: IDbConfig = {
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
