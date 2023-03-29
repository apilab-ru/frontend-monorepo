import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Team } from "../../team/models/interface";
import { User } from "../../users/models/interface";


@Injectable()
export class TeamApiService {
  private endpoint = '/team/';

  constructor(
    private http: HttpClient,
  ) {
  }

  loadUserTeam(): Observable<Team> {
    return this.http.get<Team>(this.endpoint + 'current', {
      withCredentials: true,
    })
  }

  loadTeammates(): Observable<User[]> {
    return this.http.get<User[]>(this.endpoint + 'users', {
      withCredentials: true,
    })
  }

  updateTeam(team: Team): Observable<Team> {
    return this.http.patch<Team>(this.endpoint + 'current', team, {
      withCredentials: true,
    })
  }

  addTeammate(user: Partial<User>): Observable<void> {
    return this.http.post<void>(this.endpoint + 'users/add', user, {
      withCredentials: true,
    })
  }

  deleteTeammate(userId: string): Observable<void> {
    return this.http.delete<void>(this.endpoint + 'users/' + userId, {
      withCredentials: true,
    })
  }
}
