import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { DataSourceState } from "../models/data-source-state";
import { makeStore } from "@store";
import { LibraryItemV2 } from "@filecab/models/library";

@Injectable()
export abstract class DataSourceService {
  protected state = makeStore({
    // hasMore: false,
    loading: true,
    // total: undefined as number | null | undefined,
  });

  abstract loadList(): Observable<LibraryItemV2[]>;
}

