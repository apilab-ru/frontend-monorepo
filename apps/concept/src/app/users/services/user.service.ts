import { Injectable } from '@angular/core';
import { UserApiService } from "./user-api.service";
import { BehaviorSubject, map, Observable, of, shareReplay, switchMap, tap } from "rxjs";
import { CurrentUser, User } from "../models/interface";
import { filterUndefined } from "@store/rxjs/filter-undefined";
import { LocalStorageService } from "@angular-shared/store/local-storage.service";

const storageKey = 'userStorage';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user$: Observable<CurrentUser | null>;
  token$: Observable<string | null>;

  private user = new BehaviorSubject<CurrentUser | null | undefined>(undefined);

  constructor(
    private userApiService: UserApiService,
    private storageService: LocalStorageService,
  ) {
    this.user$ = this.loadUser().pipe(
      tap(user => this.user.next(user)),
      switchMap(() => this.user.asObservable()),
      filterUndefined(),
      shareReplay({ refCount: false, bufferSize: 1 }),
    )

    this.token$ = this.user$.pipe(
      map(user => user?.token || null)
    );
  }

  auth(email: string, password: string): Observable<CurrentUser> {
    return this.userApiService.auth(email, password).pipe(
      tap()
    );
  }

  logout(): Observable<void> {
    return this.userApiService.logout();
  }

  update(user: User): Observable<User> {
    return this.userApiService.update(user).pipe(
      tap(user => {
        const { token } = this.user.value!;
        this.setUser({
          ...user,
          token
        })
      })
    );
  }

  private loadUser(): Observable<CurrentUser | null> {
    const user = this.storageService.getData(storageKey, null);
    return of(user);
  }

  private setUser(user: CurrentUser): void {
    this.user.next(user);
    this.storageService.setData(storageKey, user);
  }
}
