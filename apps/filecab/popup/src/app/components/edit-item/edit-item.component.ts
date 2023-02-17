import {
  ChangeDetectionStrategy,
  Component, OnInit
} from '@angular/core';
import { BrowserApiService } from '../../services/browser-api.service';
import { ParserSchemas } from '@filecab/parser/schemas';
import { finalize, map, switchMap } from 'rxjs';
import { makeStore } from '@store';
import { Types } from '@filecab/models/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filterUndefined } from '@store/rxjs/filter-undefined';

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

  constructor(
    private browserApiService: BrowserApiService
  ) {
  }

  ngOnInit(): void {
    this.loadBrowserData();
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
}
