import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MessageService } from "primeng/api";
import { BackgroundService } from "@filecab/background";
import { switchMap, take } from "rxjs";
import { Types } from "@filecab/models/types";

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
  ) {
  }

  fixData(): void {
    this.backgroundService.select('data').pipe(
      switchMap(data => {
        const list = data.map(item => ({
          ...item,
          type: item.type || Types.anime,
        }))

        return this.backgroundService.reduce('library', 'update')({ data: list })
      }),
      take(1)
    ).subscribe(data => {
      this.messageService.add({
        severity: 'success',
        detail: 'Done!',
      })
    })
  }
}
