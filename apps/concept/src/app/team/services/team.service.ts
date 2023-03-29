import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, startWith, switchMap, tap } from "rxjs";
import { Team } from "../models/interface";
import { TeamApiService } from "@api/services/team-api.service";
import { User } from "../../users/models/interface";
import { makeStore } from "@store";
import { filterUndefined } from "@store/rxjs/filter-undefined";

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  team$: Observable<Team>;
  teammates$: Observable<User[] | undefined>;

  private store = makeStore({
    teammatesRefresh: undefined as void,
    team: undefined as Team | undefined,
  })

  constructor(
    private teamApiService: TeamApiService,
  ) {
    this.team$ = this.teamApiService.loadUserTeam().pipe(
      tap(team => this.store.team.next(team)),
      switchMap(() => this.store.team),
      filterUndefined(),
      shareReplay({ refCount: true, bufferSize: 1 }),
    )

    this.teammates$ = this.store.teammatesRefresh.pipe(
      switchMap(() => this.teamApiService.loadTeammates().pipe(
        startWith(undefined),
      )),
      shareReplay({ refCount: true, bufferSize: 1 }),
    )
  }

  updateTeam(team: Team): Observable<Team> {
    return this.teamApiService.updateTeam(team).pipe(
      tap(() => this.store.team.next(team))
    )
  }

  addTeammate(user: Partial<User>): Observable<void> {
    return this.teamApiService.addTeammate(user).pipe(
      tap(() => this.store.teammatesRefresh.next())
    )
  }

  deleteTeammate(userId: string): Observable<void> {
    return this.teamApiService.deleteTeammate(userId).pipe(
      tap(() => this.store.teammatesRefresh.next())
    )
  }
}
