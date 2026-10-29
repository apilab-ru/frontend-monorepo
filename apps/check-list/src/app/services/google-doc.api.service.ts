import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { GoogleApiResponse } from '../interface';

@Injectable({
  providedIn: 'root',
})
export class GoogleDocApiService {
  private http = inject(HttpClient);

  fetchRows(): Observable<(string | null)[][]> {
    const { doc, gridId } = environment;

    return this.http
      .get(
        `https://docs.google.com/spreadsheets/d/${doc}/gviz/tq?tqx=out:json&tq&gid=${gridId}`,
        { responseType: 'text' }
      )
      .pipe(
        map((text) => {
          const table = text.match(/(?<="table":).*(?=}\);)/)?.[0];

          if (!table) {
            throw new Error('The spreadsheet response does not contain a table.');
          }

          const { rows } = JSON.parse(table) as GoogleApiResponse;

          return rows.map((row) => row.c.map((cell) => cell?.v ?? null));
        })
      );
  }
}
