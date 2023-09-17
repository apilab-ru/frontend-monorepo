
import { Store } from '../store';
import { Library } from '@shared/models/library';
import { deepCopy } from '@shared/utils/utils';
import { allApi } from '../api';
import { from, Observable, throwError } from 'rxjs';
import { LibraryItemV2 } from "@filecab/models/library";
import { Reducer } from "../../../../../libs/extension/src/background/reducers/reducer";

interface CRUDItem {
  item: LibraryItemV2;
}

export class LibraryReducer extends Reducer<Store> {

  update(store: Partial<Library>): Observable<void> {
    if (!store.data) {
      return throwError(() => new Error('Store data empty'))
    }

    return this.updateStore(store.data);
  }

  deleteItem({ id }: { id: number }): Observable<void> {
    const data = this.store.data.getValue();

    const index = data.findIndex(it => it.item.id === id);

    if (index === -1) {
      return throwError(() => `Item ${id} not found`);
    }

    return this.updateStore(data.filter(item => item.item.id !== id));
  }

  addItem({ item }: CRUDItem): Observable<void> {
    let data = [...this.store.data.getValue()];

    if (item.url) {
      data = this.removeUrlFromLib(data, item.url);
    }

    return this.updateStore([
      ...data,
      item,
    ]);
  }

  updateItem({ item }: CRUDItem): Observable<void> {
    let data = deepCopy(this.store.data.getValue());

    const index = data.findIndex(it => it.item.id === item.item.id);

    if (index === -1) {
      return throwError(() => `Item ${item.item.id} not found`);
    }

    if (item.url) {
      data = this.removeUrlFromLib(data, item.url);
    }

    data[index] = item;

    return this.updateStore(data);
  }

  private updateStore(data: LibraryItemV2[]): Observable<void> {
    const lastTimeUpdate = new Date().getTime();

    const store = {
      data,
      lastTimeUpdate,
    };

    this.store.data.next(data);
    this.store.lastTimeUpdate.next(lastTimeUpdate);

    return from(allApi.chromeStoreApi.setStore(store));
  }

  private removeUrlFromLib(data: LibraryItemV2[], url: string): LibraryItemV2[] {
    data.forEach((it, index) => {
      if (it.url === url) {
        data[index].url = '';
      }
    })

    return data;
  }

}
