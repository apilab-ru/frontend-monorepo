export interface IDbConfig {
  name: string;
  version: number;
  objects: IDbObject[];
}

export interface IDbObject {
  name: string;
  options?: IDBObjectStoreParameters;
}
