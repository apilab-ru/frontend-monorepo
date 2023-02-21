import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Environment } from "@environments/model";
import { MigrationResult, PreparedItem } from "@filecab/models/library";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MigrationService {
  private endpoint = this.env.apiUrl;

  constructor(
    private http: HttpClient,
    private env: Environment,
  ) {
  }

  migration(list: PreparedItem[]): Observable<MigrationResult> {
    return this.http.post<MigrationResult>(this.endpoint + 'library/migrate/v3', { list })
  }
}
