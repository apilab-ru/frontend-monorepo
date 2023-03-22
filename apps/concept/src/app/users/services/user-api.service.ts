import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CurrentUser, User } from "../models/interface";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private endpoint = '/user/';

  constructor(
    private httpClient: HttpClient,
  ) { }

  auth(email: string, password: string): Observable<CurrentUser> {
    return this.httpClient.post<CurrentUser>(this.endpoint + 'auth', {
      email,
      password
    });
  }

  logout(): Observable<void> {
    return this.httpClient.post<void>(this.endpoint + 'logout', {}, {
      withCredentials: true,
    });
  }

  update(user: User): Observable<User> {
    return this.httpClient.patch<User>(this.endpoint + user.id, user, {
      withCredentials: true,
    });
  }
}
