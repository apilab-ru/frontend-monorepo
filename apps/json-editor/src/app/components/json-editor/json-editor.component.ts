import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  DOCUMENT,
  ElementRef,
  inject,
  linkedSignal,
  type Signal,
  viewChild,
  type WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs';
import { saveAsFile } from '@store';
import { PageScrollService } from 'ngx-page-scroll-core';
import { JsonDataService } from '../../services/json-data.service';
import type {
  JsonData,
  JsonFile,
  UpdateValueEvent,
  JsonEditorSource,
  JsonEditorDraft,
  InspectorChange,
} from '../../interface';
import { PATH_SEPARATOR } from '../../const';
import { documentSelection, replaceAt, valueAt } from '../../utils/json-document';
import { JsonRowComponent } from '../json-row/json-row.component';
import { JsonInspectorComponent } from '../json-inspector/json-inspector.component';

@Component({
  selector: 'je-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [JsonRowComponent, JsonInspectorComponent],
})
export class JsonEditorComponent {
  fileName = this.createFileName();
  tempData = computed(() => this.draft().data);
  isChanged = computed(() => this.draft().changed);
  selection = computed(() => documentSelection(this.tempData(), this.routePath()));
  inspectedPath = computed(() => this.selection().path);
  inspectedValue = computed(() => valueAt(this.tempData(), this.inspectedPath()));
  columns = computed(() => this.selection().columns);
  breadcrumbs = computed(() => this.columns().slice(1));
  canRenameInspectedKey = this.createCanRenameInspectedKey();
  inspectorError = this.createInspectorError();

  private jsonDataService = inject(JsonDataService);
  private activatedRoute = inject(ActivatedRoute);
  private pageScrollService = inject(PageScrollService);
  private router = inject(Router);
  private document = inject(DOCUMENT);
  private rowsBox = viewChild<ElementRef<HTMLElement>>('rowsBox');
  private routePath = this.createRoutePath();
  private files = this.createFiles();
  private source = this.createSource();
  private fileId = computed(() => this.source().id);
  private draft = this.createDraft();

  constructor() {
    afterRenderEffect(() => {
      const rows = this.rowsBox();
      const path = this.routePath();
      const columns = this.columns();

      if (!rows || !path || columns.length < 2) return;

      this.pageScrollService.scroll({
        document: this.document,
        scrollViews: [rows.nativeElement],
        scrollTarget: '.-last',
        verticalScrolling: false,
      });
    });
  }

  applyInspectorChange(change: InspectorChange): void {
    const path = this.inspectedPath();
    const oldKey = path.at(-1);
    const renamed = this.canRenameInspectedKey() && change.key !== oldKey;
    const parentPath = path.slice(0, -1);
    const parent = valueAt(this.tempData(), parentPath) as Record<string, unknown>;
    this.inspectorError.set('');

    if (renamed && (!change.key.length || change.key.includes(PATH_SEPARATOR))) {
      this.inspectorError.set(
        `Use a nonempty key without the path separator (${PATH_SEPARATOR}).`
      );

      return;
    }

    if (renamed && Object.hasOwn(parent, change.key)) {
      this.inspectorError.set('A field with this name already exists.');

      return;
    }

    const replacement = renamed
      ? Object.fromEntries(
          Object.entries(parent).map(([key, value]) =>
            key === oldKey ? [change.key, change.value] : [key, value]
          )
        )
      : change.value;
    this.draft.set({
      data: replaceAt(this.tempData(), renamed ? parentPath : path, replacement),
      changed: true,
    });
    this.setPath(renamed ? [...parentPath, change.key] : path);
  }

  inspectKey(key: string, path: string[] = []): void {
    this.setPath([...path, key]);
  }

  goToRoot(): void {
    this.setPath([]);
  }

  goToPath(path: string[]): void {
    this.setPath(path);
  }

  onUpdateValue(event: UpdateValueEvent, path: string[]): void {
    this.draft.update((draft) => ({
      data: replaceAt(draft.data, [...path, event.key], event.value),
      changed: true,
    }));
  }

  async saveJson(): Promise<void> {
    const current = this.files().find((file) => file.id === this.fileId());

    if (!current) return;

    const data = this.tempData() as JsonData;
    const file = { ...current, data };
    saveAsFile(JSON.stringify(data), file.name);
    await this.jsonDataService.updateFile(file);

    // Preserve edits made while persistence was in flight.
    if (this.tempData() === data)
      this.draft.update((draft) => ({ ...draft, changed: false }));
  }

  async deleteFile(): Promise<void> {
    await this.jsonDataService.deleteFile(this.fileId());
    await this.router.navigate(['/']);
  }

  private createFileName(): Signal<string> {
    return computed(
      () => this.files().find((file) => file.id === this.fileId())?.name ?? ''
    );
  }

  private createCanRenameInspectedKey(): Signal<boolean> {
    return computed(() => {
      const path = this.inspectedPath();
      const parent = path.length ? valueAt(this.tempData(), path.slice(0, -1)) : null;

      return parent !== null && typeof parent === 'object' && !Array.isArray(parent);
    });
  }

  private createInspectorError(): WritableSignal<string> {
    return linkedSignal(() => {
      this.routePath();
      this.source();

      return '';
    });
  }

  private createFiles(): Signal<JsonFile[]> {
    return toSignal(this.jsonDataService.files$, {
      initialValue: [] as JsonFile[],
    });
  }

  private createRoutePath(): Signal<string> {
    return toSignal(
      this.activatedRoute.queryParams.pipe(map((params) => String(params['path'] ?? ''))),
      {
        initialValue: String(this.activatedRoute.snapshot.queryParams['path'] ?? ''),
      }
    );
  }

  private createSource(): Signal<JsonEditorSource> {
    return toSignal(
      this.activatedRoute.params.pipe(
        map(({ id }) => +id),
        distinctUntilChanged(),
        switchMap((id) =>
          this.jsonDataService.loadFileData(id).pipe(
            map((data) => ({ id, data })),
            startWith({ id, data: null as JsonData | null })
          )
        )
      ),
      {
        initialValue: {
          id: +this.activatedRoute.snapshot.params['id'],
          data: null as JsonData | null,
        },
      }
    );
  }

  private createDraft(): WritableSignal<JsonEditorDraft> {
    return linkedSignal<JsonEditorSource, JsonEditorDraft>({
      source: this.source,
      computation: (source, previous) => {
        const edited = previous?.value;

        if (
          source.data !== null &&
          previous?.source.id === source.id &&
          edited.changed &&
          edited.data !== source.data
        ) {
          return edited;
        }

        return { data: source.data, changed: false };
      },
    });
  }

  private setPath(path: string[]): void {
    this.inspectorError.set('');
    const encoded = path.join(PATH_SEPARATOR);

    if (this.routePath() === encoded) return;

    void this.router.navigate([], {
      queryParams: { path: encoded },
      queryParamsHandling: 'merge',
    });
  }
}
