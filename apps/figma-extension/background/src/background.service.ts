import { Injectable, NgZone } from "@angular/core";
import { allApi } from "./api";
import { EXSBackgroundService } from "@apilab/extension/background-angular";
import { Store } from "./store";

import { Reducers } from "./reducers";

type AllApiTypes = typeof allApi;

@Injectable({ providedIn: 'root' })
export class BackgroundService extends EXSBackgroundService<Store, AllApiTypes, Reducers> {
  constructor(
    ngZone: NgZone,
  ) {
    super(ngZone);
  }
}
