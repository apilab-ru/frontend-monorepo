import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { from, Observable } from "rxjs";
import { GoogleApiResponse } from "../interface";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class GoogleDocApiService {

  fetchRows(): Observable<(string | null)[][]> {
    const id = environment.doc;
    const gid = environment.gridId;
    return from(
      fetch(`https://docs.google.com/spreadsheets/d/${ id }/gviz/tq?tqx=out:json&tq&gid=${ gid }`)
        .then(res => res.text())
        .then(text => JSON.parse(text.match(/(?<="table":).*(?=}\);)/g)![0]) as GoogleApiResponse)
    ).pipe(
      map(({ rows }) => rows.map(row => row?.c.map(ceil => ceil?.v || null )))
    );
  }
}
