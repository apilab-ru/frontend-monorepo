import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { StoreService } from "./store.service";
import { JsonFile } from "../interface";

@Injectable({
  providedIn: 'root'
})
export class JsonDataService<D> {
  private storeData = new BehaviorSubject<JsonFile<D> | null>(null);

  data$ = this.storeData.asObservable();

  constructor(
    private storeService: StoreService<D>,
  ) {
    this.storeService.readJsonFile().then(file => {
      this.storeData.next(file);
    })
  }

  setData(data: D, name: string): void {
    this.storeData.next({ name, data });
    this.storeService.saveJsonFile(data, name);
  }
}
