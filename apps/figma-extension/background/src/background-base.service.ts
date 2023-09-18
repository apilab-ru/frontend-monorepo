import { Environment } from '@environments/model';
import { allApi } from "./api";
import { Store } from "./store";

import { Reducers } from "./reducers";
import { EXSBackgroundBaseService } from "../../../../libs/extension/src/background/background-base.service";

type AllApiTypes = typeof allApi;

export class BackgroundBaseService extends EXSBackgroundBaseService<Store, AllApiTypes, Reducers> {
}
