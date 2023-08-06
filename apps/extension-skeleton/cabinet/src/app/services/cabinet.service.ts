import { Injectable } from '@angular/core';
import { BackgroundService } from "@background";
import { map, Observable } from "rxjs";
import { GithubRepo } from "@shared/github";
import { User } from "@shared/user";

@Injectable({
  providedIn: 'root'
})
export class CabinetService {
  repos$: Observable<GithubRepo[] | undefined>
  counter$: Observable<number>;

  constructor(
    private backgroundService: BackgroundService,
  ) {
    this.backgroundService.fetch('boredApi', 'fetchBored')({ min: 1, max: 1 }).subscribe(data => {
      console.log('xxx data', data);
    })

    this.repos$ = this.backgroundService.select('repos');
    this.counter$ = this.backgroundService.select('test').pipe(
      map(res => res?.counter)
    )
  }

  updateUser(user: User): Observable<void> {
    return this.backgroundService.reduce('user', 'update')(user);
  }

  increment(): void {
    this.backgroundService.reduce('test', 'increment')('');
  }

  decrement(): void {
    this.backgroundService.reduce('test', 'decrement')('');
  }
}
