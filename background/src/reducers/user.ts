import { Reducer } from './reducer';
import { Store } from '../store';
import { from, Observable } from 'rxjs';
import { LibrarySettings } from '@shared/models/library';
import { allApi } from '../api';

export class UserReducer extends Reducer<Store> {

  updateSettings(settings: LibrarySettings): Observable<void> {
    return from(allApi.chromeStoreApi.setGlobalStorage(settings));
  }
}
