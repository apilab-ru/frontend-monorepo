import { allApi } from "./api";
import { Store } from "./store";

import { Reducers } from "./reducers";
import { EXSBackgroundBaseService } from "../../../../libs/extension/background";

type AllApiTypes = typeof allApi;

export class BackgroundBaseService extends EXSBackgroundBaseService<Store, AllApiTypes, Reducers> {
}
