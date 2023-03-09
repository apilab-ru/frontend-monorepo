import { Injectable } from "@angular/core";

const BASE_KEY = 'filecabKey';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  getData<T>(key: string): T | null {
    const data = localStorage.getItem(BASE_KEY + key);

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  }

  setData<T>(key: string, data: T): void {
    localStorage.setItem(BASE_KEY + key, JSON.stringify(data));
  }

}