import { UserReducer } from "./user";
import { store$ } from "../store";
import { TestReducer } from "./test";

export const reducers = {
  user: new UserReducer(store$),
  test: new TestReducer(store$),
}

export type Reducers = typeof reducers;
