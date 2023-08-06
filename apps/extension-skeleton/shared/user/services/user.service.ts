import { Injectable } from '@angular/core';
import { BackgroundService } from "@background";
import { User } from "@shared/user";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user$ = this.backgroundService.select('user');

  constructor(
    private backgroundService: BackgroundService,
  ) {
  }

  updateUser(user: User): Observable<void> {
    return this.backgroundService.reduce('user', 'update')(user);
  }
}
