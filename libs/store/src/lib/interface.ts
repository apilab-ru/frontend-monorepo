export interface DbConfig {
  name: string;
  version: number;
  objects: DbObject[];
}

export interface DbObject<T = object> {
  name: string;
  options?: IDBObjectStoreParameters;
  values?: T[];
}
