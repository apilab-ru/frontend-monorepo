import { store$ } from '../store';
import { LibraryReducer } from './library';
import { UserReducer } from './user';

export const reducers = {
  library: new LibraryReducer(store$),
  user: new UserReducer(store$),
};

export type Reducers = typeof reducers;
