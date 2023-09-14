import { store$ } from "../store";
import { ConfigReducer } from "./config";

export const reducers = {
  config: new ConfigReducer(store$),
}

export type Reducers = typeof reducers;
