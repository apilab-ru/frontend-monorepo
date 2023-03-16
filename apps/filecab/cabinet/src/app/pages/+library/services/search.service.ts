import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, ReplaySubject, shareReplay } from "rxjs";
import { Types } from "@filecab/models/types";
import { ActivatedRoute } from "@angular/router";
import { LibraryMode } from "../models/mode";
import { FilterSearchData } from "@filecab/ui-kit/filter-search/interface";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private data = new ReplaySubject<FilterSearchData>(1);

  data$ = this.data.asObservable();
  type$: Observable<Types>;
  mode$ = new BehaviorSubject<LibraryMode>(LibraryMode.library);

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
    this.type$ = this.activatedRoute.data.pipe(
      map(data => data.type),
      shareReplay({ refCount: true, bufferSize: 1 }),
    );
  }

  setMode(mode: LibraryMode): void {
    this.mode$.next(mode);
  }

  setData(data: FilterSearchData): void {
    console.log('xxx set data', data);
    console.trace();
    this.data.next(data);
  }
}
