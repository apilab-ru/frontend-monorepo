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

export interface JsonEditorSource {
  id: number;
  data: JsonData | null;
}

export interface JsonEditorDraft {
  data: unknown;
  changed: boolean;
}

export interface InspectorChange {
  key: string;
  value: unknown;
}

export interface InspectorDraft {
  key: string;
  json: string;
}

export enum FieldType {
  object = 'object',
  simple = 'simple',
}

export interface Field {
  key: string;
  type: FieldType;
  value: Value;
  fullValue: string;
  kind: string;
  icon: string;
}

export interface JsonColumn {
  id: string;
  key: string;
  path: string[];
  data: Record<string, unknown>;
  selected: string | null;
}

export interface DocumentSelection {
  path: string[];
  columns: JsonColumn[];
}

export interface InspectorParseResult {
  value: unknown;
  error: string;
}
