import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  public getData<T>(key: string, defaultData?: T): T {
    const value = localStorage.getItem(key);

    if (!value) {
      if (defaultData !== undefined) {
        return defaultData;
      } else {
        throw Error(`Data ${key} is empty!`);
      }
    }

    try {
      return JSON.parse(value);
    } catch (error: any) {
      if (defaultData !== undefined) {
        return defaultData;
      } else {
        throw Error(`Error parse ${key}: ` + error.toString());
      }
    }
  }

  public setData<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
