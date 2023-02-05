import { ChangeDetectionStrategy, Component, OnInit, } from '@angular/core';
import { JsonDataService } from "../../services/json-data.service";
import { ActivatedRoute } from "@angular/router";
import { map, Observable, switchMap, tap } from "rxjs";
import { JsonData } from "../../interface";
import lodashGet from 'lodash-es/get';

interface Path {
  key: string;
  full: string[];
  dept: number;
}

@Component({
  selector: 'je-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonEditorComponent implements OnInit {
  private fileId$ = this.activatedRoute.params.pipe(map(({ id }) => +id));

  paths: Path[] = [];
  data$: Observable<JsonData>;

  constructor(
    private jsonDataService: JsonDataService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.data$ = this.fileId$.pipe(
      switchMap(id => this.jsonDataService.loadFileData(id)),
      tap(() => {
        this.paths = [];
      }),
    )
  }

  goToPath(index: number): void {
    const paths = this.paths.slice(0, index);
    this.paths = paths;
  }

  getSelectedDeepKey(index: number): string | null {
    if (this.paths.length > index) {
      return this.paths[index].key;
    }

    return null;
  }

  selectPath(child: string, prev?: Path): void {
    const dept = (prev?.dept || 0) + 1;
    const path = !prev ? [] : this.paths.slice(0, prev.dept);
    const full = (prev ? [...prev.full, child] : [child]);

    path.push({
      key: child,
      dept,
      full,
    })

    this.paths = path;
  }

  pickData(data: JsonData, path: Path): JsonData {
    return lodashGet(data, path.full);
  }
}
