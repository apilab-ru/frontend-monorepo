import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageService } from "primeng/api";
import { BackgroundService } from "@filecab/background";
import { firstValueFrom, take } from "rxjs";
import { FileCabService } from "@shared/services/file-cab.service";
import { saveAsFile } from "@store";
import { readFile } from "@store/lib/files";
import { LibraryItemV2 } from "@filecab/models/library";

@Component({
  selector: 'cabinet-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportComponent {
  constructor(
    private messageService: MessageService,
    private backgroundService: BackgroundService,
    private fileCabService: FileCabService,
  ) {
  }

  exportData(): void {
    this.fileCabService.data$.pipe(
      take(1)
    ).subscribe(data => {
      saveAsFile(JSON.stringify(data), 'backup.json');
      this.messageService.add({
        severity: 'success',
        detail: 'Done!'
      })
    })
  }

  importData(fileList: FileList): void {
    if (!fileList.length) {
      return;
    }

    readFile(fileList.item(0))
      .then(result => JSON.parse(result))
      .then((data: LibraryItemV2[]) => firstValueFrom(this.fileCabService.updateStore({ data })))
      .then(() => this.messageService.add({
        severity: 'success',
        detail: 'Done!'
      }))
      .catch(err => this.messageService.add({
        severity: 'error',
        detail: err
      }))
  }
}
