import { Injectable } from '@angular/core';
import { GoogleDocApiService } from "./google-doc.api.service";
import { Observable } from "rxjs";
import { GroupPoints } from "../interface";
import { map } from "rxjs/operators";

enum Rows {
  title,
  text,
  description
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(
    private api: GoogleDocApiService,
  ) {
  }

  loadPoints(): Observable<GroupPoints[]> {
    return this.api.fetchRows().pipe(
      map(rows => {
        const stack: GroupPoints[] = [];

        rows.forEach(row => {
          if (row[Rows.title]) {
            stack.push({
              title: row[Rows.title]!,
              list: [],
            })
          } else if (row[Rows.text]) {
            const index = stack.length - 1;
            stack[index].list.push({
              text: row[Rows.text]!,
              description: row[Rows.description] || undefined,
            })
          }
        });

        return stack;
      })
    );
  }

}
