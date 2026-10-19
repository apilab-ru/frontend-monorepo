import { User } from "@shared/user/interface";
import { Store } from "../store";
import { Reducer } from "../../../../../libs/extension/background/src/reducers/reducer";
import { Observable, of } from "rxjs";

export class UserReducer extends Reducer<Store> {

  update(user: User): Observable<void> {
    this.store.user.next(user);

    return of(undefined);
  }

}
