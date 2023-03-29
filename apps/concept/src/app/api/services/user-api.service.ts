import { Injectable } from '@angular/core';
import { CurrentUser, User } from "../../users/models/interface";
import { from, Observable, throwError } from "rxjs";
import { LocalDbStoreService } from "./local-db-store.service";

@Injectable()
export class UserApiService {
  constructor(
    private localDbStoreService: LocalDbStoreService,
  ) { }

  loadAvailableUsers(): Observable<CurrentUser[]> {
    return from(this.localDbStoreService.select('users'));
  }

  auth(email: string, password: string): Observable<CurrentUser> {
    return from(this.localDbStoreService.select('users', email).then(list => {
      const user = list.find(it => it.password === password);

      if (user) {
        user.token = this.localDbStoreService.genUuid();

        this.localDbStoreService.setUser(user);
        this.localDbStoreService.updateItem('users', user);

        return user;
      }

      throw Error('notFound');
    }))
  }

  logout(): Observable<void> {
    const user = this.localDbStoreService.getUser();

    if (!user) {
      return throwError(() => new Error('authRequired'));
    }

    user.token = '';

    return from(this.localDbStoreService.updateItem('users', user).then(() => {
      this.localDbStoreService.setUser(null);
    }));
  }

  update(user: User): Observable<User> {
    const fullUser = this.localDbStoreService.getUser();

    if (!fullUser) {
      return throwError(() => new Error('authRequired'));
    }

    const newUser = {
      ...fullUser,
      ...user,
    };

    return from(this.localDbStoreService.updateItem('users', fullUser).then(() => {
      this.localDbStoreService.setUser(fullUser);

      return fullUser;
    }));
  }
}
