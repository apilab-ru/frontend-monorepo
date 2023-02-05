export type JsonData = Record<string, unknown>;

export interface JsonFile {
  name: string;
  data: JsonData;
  id?: number;
}

export interface DBStore {
  jsonFiles: JsonFile;
}

export interface Tab {
  name: string;
  id: number;
}

export interface MenuItem {
  name: string;
  path: string;
}

export type Value = string | number;

export interface UpdateValueEvent {
  key: string;
  value: Value;
}
