import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Environment } from "@environments/model";
import { LibraryItemV2, MigrationResult, PreparedItem } from "@filecab/models/library";
import { Observable } from "rxjs";
import { format, add } from "date-fns";

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

  checkData(list: LibraryItemV2[]): Observable<MigrationResult> {
    const now = new Date();

    const date = format(now, 'yyyy-MM-dd');

    let fakeTime = new Date(format(now, 'yyyy-MM-dd'));

    const preparedList = list.map(item => {
      if (!item.dateAd || !item.dateChange) {
        fakeTime = add(fakeTime, {
          minutes: 1
        })
      }

      return {
        ...item,
        dateAd: item.dateAd || format(fakeTime, 'yyyy-MM-dd HH:mm:ss'),
        dateChange: item.dateChange || format(fakeTime, 'yyyy-MM-dd HH:mm:ss')
      }
    })

    return this.http.post<MigrationResult>(this.endpoint + 'library/check/v3', {
      list: preparedList,
    })
  }
}
