import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MigrationProcessData } from "./interface";
import { LibraryItemV2, ManyResultItem, MediaItemV2, PreparedItem } from "@filecab/models/library";
import {
  BehaviorSubject,
  catchError,
  map,
  merge,
  Observable,
  of,
  ReplaySubject,
  shareReplay,
  switchMap,
  tap
} from "rxjs";
import { FormControl, FormGroup } from "@angular/forms";
import { Types } from "@filecab/models/types";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { BackgroundService, FileCabApi } from "@filecab/background";
import { Environment } from "@environments/model";
import format from 'date-fns/format'
import { MetaData } from "@filecab/models/meta-data";
import { makeStore } from "@store";

@UntilDestroy()
@Component({
  selector: 'cabinet-migration-process',
  templateUrl: './migration-process.component.html',
  styleUrls: ['./migration-process.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MigrationProcessComponent implements OnInit {
  process: ManyResultItem[];
  results: LibraryItemV2[] = [];

  currentItem$ = new ReplaySubject<ManyResultItem>(1);
  isLoading$ = new BehaviorSubject(false);

  items$: Observable<MediaItemV2[]>;
  form: FormGroup;
  preloaderItems = new Array(3).fill(1);

  private itemsSubject = new ReplaySubject<MediaItemV2[]>(1);
  private fileCabApi: FileCabApi;
  private store = makeStore({
    meta: null as null | MetaData,
  })

  meta$ = this.store.meta.asObservable();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: MigrationProcessData,
    private matDialogRef: MatDialogRef<LibraryItemV2[]>,
    private backgroundService: BackgroundService,
    private env: Environment,
  ) {
    this.process = data.items;

    this.form = new FormGroup({
      name: new FormControl(''),
      type: new FormControl<Types>(null),
    });

    this.next();

    this.fileCabApi = new FileCabApi(this.env);
  }

  ngOnInit(): void {
    this.items$ = this.currentItem$.pipe(
      switchMap(({ item, list }) => {
        this.itemsSubject.next(list);

        const { item: _it, ...meta } = item;
        this.store.meta.next(meta);

        this.form.patchValue({
          name: item.name || item.item.title || '',
          type: item.type,
        })

        return merge(
          this.itemsSubject,
          this.loadResult(),
        )
      }),
      shareReplay({ refCount: true, bufferSize: 1 }),
    );

    this.items$.pipe(
      untilDestroyed(this)
    ).subscribe();
  }

  updateMeta(meta: MetaData): void {
    this.store.meta.next({
      ...this.store.meta.value,
      ...meta
    });
  }

  skip(): void {
    this.next();
  }

  select(mediaItem: MediaItemV2, oldItem: PreparedItem): void {
    const { type, name } = this.form.getRawValue();

    const item = {
      ...oldItem,
      ...this.store.meta.value,
      type,
      name,
      dateAd: '',
      dateChange: '',
      item: mediaItem
    };
    this.results.push(item);

    this.next();
  }

  private loadResult(): Observable<MediaItemV2[]> {
    return this.form.valueChanges.pipe(
      // skip(1),
      switchMap(form => {
        this.isLoading$.next(true);

        return this.fileCabApi.searchApi({
          type: form.type,
          param: { name: form.name }
        }).pipe(
          map(res => res.results as MediaItemV2[]),
          catchError(error => {
            console.error(error);
            return of([]);
          }),
        )
      }),
      tap(list => {
        console.log('xxx list', list);
        this.isLoading$.next(false)
      }),
    )
  }

  next(): void {
    if (!this.process.length) {
      this.matDialogRef.close(this.results);
      return;
    }

    const [item] = this.process.splice(0, 1);
    this.currentItem$.next(item);
  }
}
