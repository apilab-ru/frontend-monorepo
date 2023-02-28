import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from "rxjs";
import { Types } from "@filecab/models/types";
import { ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  type$: Observable<Types>;

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
    this.type$ = this.activatedRoute.data.pipe(
      map(data => data.type),
      shareReplay({ refCount: true, bufferSize: 1 }),
    );
  }
}
