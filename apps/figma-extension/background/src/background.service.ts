import { Injectable, NgZone } from "@angular/core";
import { Environment } from '@environments/model';
import { allApi } from "./api";
import { EXSBackgroundService } from "../../../../libs/extension/src/background/background.service";
import { Store } from "./store";

import { Reducers } from "./reducers";

type AllApiTypes = typeof allApi;

@Injectable({ providedIn: 'root' })
export class BackgroundService extends EXSBackgroundService<Store, AllApiTypes, Reducers> {
  constructor(
    environment: Environment,
    ngZone: NgZone,
  ) {
    super(environment, ngZone);
  }
}
