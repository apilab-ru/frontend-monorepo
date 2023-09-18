import { Injectable, NgZone } from '@angular/core';
import { allApi } from './api';
import { Store } from './store';
import { Reducers } from './reducers';
import { EXSBackgroundService } from "../../../../libs/extension/src/background/background.service";

type AllApiTypes = typeof allApi;

@Injectable({ providedIn: 'root' })
export class BackgroundService extends EXSBackgroundService<Store, AllApiTypes, Reducers> {
  constructor(
    ngZone: NgZone,
  ) {
    super(ngZone);
  }
}
