import cloneDeep from 'lodash-es/cloneDeep';

export function deepCopy<T>(obj: T): T {
  return cloneDeep(obj);
}
