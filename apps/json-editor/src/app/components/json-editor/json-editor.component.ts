import { ChangeDetectionStrategy, Component, OnInit, } from '@angular/core';
import { JsonDataService } from "../../services/json-data.service";
import { ActivatedRoute, Router } from "@angular/router";
import { map, Observable, switchMap, take, tap } from "rxjs";
import { JsonData, UpdateValueEvent } from "../../interface";
import lodashGet from 'lodash-es/get';
import lodashSet from 'lodash-es/set';
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { saveAsFile } from "@utils-monorep/store";

interface Path {
  key: string;
  full: string[];
  fullSt: string;
}


@UntilDestroy()
@Component({
  selector: 'je-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonEditorComponent implements OnInit {
  private fileId$ = this.activatedRoute.params.pipe(map(({ id }) => +id));
  private fileId: number;

  isChanged = false;
  paths$: Observable<Path[]>;
  data$: Observable<JsonData>;
  tempData: JsonData;

  constructor(
    private jsonDataService: JsonDataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.data$ = this.fileId$.pipe(
      tap(fileId => this.fileId = fileId),
      switchMap(id => this.jsonDataService.loadFileData(id)),
    );

    this.data$.pipe(
      untilDestroyed(this)
    ).subscribe(data => {
      this.tempData = data;
      this.isChanged = false;
    })

    this.paths$ = this.activatedRoute.queryParams.pipe(
      map(params => {
        const path = params?.path;
        return this.parserPath(path);
      })
    );
  }

  goToPath(path: Path): void {
    this.setPath(path.fullSt);
  }

  getSelectedDeepKey(index: number): Observable<string | null> {
    return this.paths$.pipe(
      map(paths => {
        if (paths.length > index) {
          return paths[index].key;
        }

        return null;
      })
    )
  }

  selectPath(child: string, prev?: Path): void {
    const path = prev ? prev.full : [];
    path.push(child);
    this.setPath(path.join('.'));
  }

  pickData(data: JsonData, path: Path): JsonData {
    return lodashGet(data, path.full);
  }

  trackByPath(_index: number, path: Path): string {
    return path.fullSt;
  }

  onUpdateValue(event: UpdateValueEvent, path: Path): void {
    const dir = [...path.full, event.key].join('.');
    lodashSet(this.tempData, dir, event.value);
    this.isChanged = true;
  }

  saveJson(): void {
    this.jsonDataService.files$.pipe(
      take(1),
      map(list => {
        const file = list.find(it => it.id === this.fileId)!;
        return  {
          ...file,
          data: this.tempData,
        }
      }),
    ).subscribe(file => {
      saveAsFile(JSON.stringify(file.data), file.name);
      this.jsonDataService.updateFile(file);
    });
  }

  private parserPath(path: string): Path[] {
    const keys = path.split('.');
    const list: Path[] = [];

    keys.forEach(key => {
      const prev = list.map(({ key }) => key);
      const full = [...prev, key];
      list.push({
        key,
        full,
        fullSt: full.join('.')
      })
    })

    return list;
  }

  private setPath(path: string): void {
    this.router.navigate([], {
      queryParams: {
        path
      }
    })
  }
}
