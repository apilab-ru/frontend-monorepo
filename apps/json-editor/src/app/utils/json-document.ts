import type { JsonColumn, DocumentSelection } from '../interface';
import { PATH_SEPARATOR } from '../const';

export function valueAt(data: unknown, path: string[]): unknown {
  return path.reduce<unknown>(
    (value, key) =>
      value !== null && typeof value === 'object' && Object.hasOwn(value, key)
        ? (value as Record<string, unknown>)[key]
        : undefined,
    data
  );
}

export function replaceAt(data: unknown, path: string[], value: unknown): unknown {
  if (!path.length) return value;

  const [key, ...rest] = path;

  if (Array.isArray(data)) {
    return data.map((item, index) =>
      String(index) === key ? replaceAt(item, rest, value) : item
    );
  }

  return Object.fromEntries(
    Object.entries(data as Record<string, unknown>).map(([name, item]) => [
      name,
      name === key ? replaceAt(item, rest, value) : item,
    ])
  );
}

export function documentSelection(data: unknown, path: string): DocumentSelection {
  const selected: string[] = [];
  const columns: JsonColumn[] = [];
  let value = data;

  if (value !== null && typeof value === 'object') {
    columns.push({
      id: '[]',
      key: 'root',
      path: [],
      data: value as Record<string, unknown>,
      selected: null,
    });
  }

  for (const key of path ? path.split(PATH_SEPARATOR) : []) {
    if (value === null || typeof value !== 'object' || !Object.hasOwn(value, key)) break;

    columns.at(-1).selected = key;
    selected.push(key);
    value = (value as Record<string, unknown>)[key];

    if (value !== null && typeof value === 'object') {
      columns.push({
        id: JSON.stringify(selected),
        key,
        path: [...selected],
        data: value as Record<string, unknown>,
        selected: null,
      });
    }
  }

  return { path: selected, columns };
}
