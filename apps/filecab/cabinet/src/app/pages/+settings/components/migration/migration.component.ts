import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Library } from "@shared/models/library";
import { LibraryItemV2, ManyResultItem, PreparedItem } from "@filecab/models/library";
import { Types } from "@filecab/models/types";
import { MigrationService } from "../../services/mirgration.service";
import { BehaviorSubject, finalize, map, Observable, of, shareReplay, switchMap, tap } from "rxjs";
import { MessageService } from 'primeng/api';
import { MatDialog } from "@angular/material/dialog";
import { MigrationProcessComponent } from "../migration-process/migration-process.component";
import { MigrationProcessData } from "../migration-process/interface";
import { Genre } from "@filecab/models/genre";
import { BackgroundService } from "@filecab/background";

const KEY_SAVE = 'filecab-migration-list';
const KEY_MIGRATION_COMPLETED = 'filecabMigrationCompleted';
const CHUNK_SIZE = 20;

@Component({
  selector: 'cabinet-migration',
  templateUrl: './migration.component.html',
  styleUrls: ['./migration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class MigrationComponent implements OnInit {
  rawData = '';
  parsedList: PreparedItem[];
  readyItems: LibraryItemV2[];
  process$ = new BehaviorSubject(false);
  chunkSize = CHUNK_SIZE;
  genres$: Observable<Genre[]>;

  constructor(
    private migrationService: MigrationService,
    private messageService: MessageService,
    private backgroundService: BackgroundService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    if (localStorage.getItem(KEY_SAVE)) {
      const rawData = localStorage.getItem(KEY_SAVE);
      this.parsedList = JSON.parse(rawData);
    }

    if (localStorage.getItem(KEY_MIGRATION_COMPLETED)) {
      const rawData = localStorage.getItem(KEY_MIGRATION_COMPLETED);
      this.readyItems = JSON.parse(rawData);
    } else {
      this.readyItems = [];
    }

    this.genres$ = this.backgroundService.select('genres').pipe(
      shareReplay({ refCount: true, bufferSize: 1 })
    );
  }

  onInput(data: string): void {
    const parsedData: Library = JSON.parse(data);

    const parsedList: PreparedItem[] = [];
    const keys = Object.keys(parsedData.data);

    keys.forEach(type => {
      parsedData.data[type].forEach(item => {
        parsedList.push({
          ...item,
          type: type as Types,
        })
      })
    })

    this.saveMigrationProcess(parsedList, []);
  }

  startMigration(): void {
    this.process$.next(true);

    const parsedList = [...this.parsedList];
    const chunk = parsedList.splice(0, this.chunkSize);

    this.migrationService
      .migration(chunk)
      .pipe(
        finalize(() => this.process$.next(false)),
        tap(result => {
          if (result.migrated.length) {
            this.messageService.add({
              severity: 'success',
              detail: `Успешная миграция ${result.migrated.length}`
            })
          }
        }),
        switchMap(result => !result.manyResults?.length
          ? of(result.migrated)
          : this.manualMigrate(result.manyResults).pipe(
            map(list => ([...result.migrated, ...list]))
          )
        ),
      )
      .subscribe({
        next: result => {
          console.log('xxx complete', result);

          this.messageService.add({
            severity: 'success',
            detail: `Данные сохранены ${result.length}`
          })

          const readyItems = [...this.readyItems, ...result];
          this.saveMigrationProcess(parsedList, readyItems);
        },
        error: error => {
          console.log('xxx error', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.toString() });
        }
      });
  }

  private manualMigrate(items: ManyResultItem[]): Observable<LibraryItemV2[]> {
    return this.dialog.open<unknown, MigrationProcessData, LibraryItemV2[]>(MigrationProcessComponent, {
      data: {
        items
      },
    }).afterClosed();
  }

  private saveMigrationProcess(prepared: PreparedItem[], migrated: LibraryItemV2[]): void {
    this.parsedList = prepared;
    this.readyItems = migrated;

    localStorage.setItem(KEY_SAVE, JSON.stringify(prepared));
    localStorage.setItem(KEY_MIGRATION_COMPLETED, JSON.stringify(migrated));
  }
}