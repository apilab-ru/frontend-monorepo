import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BrowserApiService } from './services/browser-api.service';
import { forkJoin, from, Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseInfo } from '@shared/popup-add-item/models/base-info';
import { FileCabService } from '@shared/services/file-cab.service';
import { ParserFounded } from './interface';
import { parserPresets } from '@shared/parser/const';
import { captureException } from '@sentry/angular';
import { ParserSchemas, SchemaFuncRes } from '@shared/parser/schemas';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  baseInfo$: Observable<BaseInfo | null>;
  parserPreset$: Observable<ParserFounded | null>;

  private parserSchemas = new ParserSchemas();

  constructor(
    private browserApiService: BrowserApiService,
    private matSnackBar: MatSnackBar,
    private fileCabService: FileCabService,
  ) {
  }

  ngOnInit(): void {
    this.baseInfo$ = this.createBaseInfo();
    this.parserPreset$ = this.searchPreset();
  }

  onSave(): void {
    this.matSnackBar.open('Сохранено', undefined, {
      duration: 2000,
    });
  }

  private searchPreset(): Observable<ParserFounded | null> {
    return from(this.browserApiService.getActiveTabLinks()).pipe(
      map(({ url, domain }) => {
        const preset = parserPresets.find(it => it.domain === domain);

        return !preset ? null : {
          ...preset,
          founded: preset.host === '*' ? true : preset.host.test(url),
        };
      }),
    );
  }

  private createBaseInfo(): Observable<BaseInfo | null> {
    return from(this.browserApiService.getActiveTab()).pipe(
      switchMap(tab => {
        const { url, domain } = this.browserApiService.getTabLinks(tab);
        const schema = this.parserSchemas.getSchema(domain);

        return from(this.browserApiService.executeScriptOnTab<SchemaFuncRes>(
          tab.id,
          schema.func,
        )).pipe(
          map(result => ({
            result,
            type: result?.type || schema.type,
            url,
            domain,
          })),
        );
      }),
    ).pipe(
      switchMap(({ type, result, url, domain }) => {
        return forkJoin([
          this.fileCabService.searchByUrl(url, type),
          this.fileCabService.searchByName(result?.title, type),
        ]).pipe(
          map(([itemByUrl, itemByName]) => {
            return {
              type,
              title: result?.title,
              url,
              domain,
              localItem: itemByUrl || itemByName,
            };
          }),
        );
      }),
      map(({ title, url, domain, localItem, type }) => {
        const name = localItem ? localItem.name : title;

        return {
          type: localItem?.type || type,
          name,
          url,
          domain,
        };
      }),
      catchError((error) => {
        captureException(error);

        return of(null);
      }),
      shareReplay({ refCount: true, bufferSize: 1 }),
    );
  }
}
