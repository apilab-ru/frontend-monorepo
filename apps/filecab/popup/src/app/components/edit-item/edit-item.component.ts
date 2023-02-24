import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';
import { BrowserApiService } from '../../services/browser-api.service';
import { ParserSchemas } from '@filecab/parser/schemas';
import { catchError, combineLatest, filter, finalize, map, Observable, of, switchMap } from 'rxjs';
import { makeStore } from '@store';
import { Types } from '@filecab/models/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filterUndefined } from '@store/rxjs/filter-undefined';
import { FileCabService } from "@shared/services/file-cab.service";
import { LibraryItemV2 } from "@filecab/models/library";

const STORE = {
  type: undefined as Types | undefined,
  url: undefined as string | undefined,
  name: undefined as string | undefined,
  isLoading: true
};

@UntilDestroy()
@Component({
  selector: 'popup-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditItemComponent implements OnInit {
  private parserSchemas = new ParserSchemas();
  private store = makeStore(STORE);

  type$ = this.store.type.pipe(filterUndefined());
  name$ = this.store.name.pipe(filterUndefined());
  libraryItem$: Observable<LibraryItemV2 | null>;

  constructor(
    private browserApiService: BrowserApiService,
    private filecabService: FileCabService,
  ) {
  }

  ngOnInit(): void {
    this.loadBrowserData();

    this.libraryItem$ = this.loadLibraryItem();

    this.libraryItem$.subscribe(item => console.log('xxx item', item))
  }

  onTypeChange(type: Types): void {
    this.store.type.next(type);
  }

  onNameChange(name: string): void {
    this.store.name.next(name);
  }

  private loadBrowserData(): void {
    this.browserApiService.getActiveTab()
      .pipe(
        switchMap(tab => {
          const { url, domain } = this.browserApiService.getTabLinks(tab);
          const schema = this.parserSchemas.getSchema(domain);

          return this.browserApiService.executeScriptOnTab(tab.id, schema.func).pipe(
            map(item => ({
              item,
              url,
              type: schema.type
            }))
          );
        }),
        finalize(() => this.store.isLoading.next(false)),
        catchError((er) => {
          console.error('error', er);

          return of(null);
        }),
        filter(Boolean),
        untilDestroyed(this),
      )
      .subscribe({
        next: ({ item, url, type }) => {
          this.store.update({
            type: (item?.type as Types) || type,
            url,
            name: item.title
          });
        }
      });
  }

  private loadLibraryItem(): Observable<LibraryItemV2 | null> {
    const byUrl$ = this.store.url.pipe(
      filterUndefined(),
      switchMap(url => this.filecabService.searchByUrl(url)),
    );

    const byName$ = combineLatest([
      this.store.type.pipe(filterUndefined()),
      this.store.name.pipe(filterUndefined())
    ]).pipe(
      switchMap(([type, name]) => this.filecabService.searchByName(name, type)),
    );

    return combineLatest([
      byUrl$,
      byName$
    ]).pipe(
      map(([byUrl, byName]) => byUrl || byName)
    );
  }
}
