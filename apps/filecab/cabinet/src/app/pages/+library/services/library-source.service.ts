import { Injectable } from "@angular/core";
import { SearchService } from "./search.service";
import { LocalDataSourceService } from "./local-data-source.service";
import { ApiDataSourceService } from "./api-data-source.service";
import { distinctUntilChanged, Observable, shareReplay, switchMap } from "rxjs";
import { LibraryItemV2 } from "@filecab/models/library";
import { LibraryMode } from "../models/mode";

@Injectable()
export class LibrarySourceService {
  list$: Observable<LibraryItemV2[]>;

  constructor(
    private searchService: SearchService,
    private localDataSourceService: LocalDataSourceService,
    private apiDataSourceService: ApiDataSourceService,
  ) {
    this.list$ = this.searchService.mode$.pipe(
      distinctUntilChanged(),
      switchMap(mode => mode === LibraryMode.library
        ? this.localDataSourceService.loadList()
        :this.apiDataSourceService.loadList()
      ),
      shareReplay({ refCount: true, bufferSize: 1 }),
    );
  }
}