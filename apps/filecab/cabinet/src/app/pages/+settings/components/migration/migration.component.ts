import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Library } from "@shared/models/library";
import { LibraryItemV2, PreparedItem } from "@filecab/models/library";
import { Types } from "@filecab/models/types";

const KEY_SAVE = 'filecab-migration-list';


@Component({
  selector: 'cabinet-migration',
  templateUrl: './migration.component.html',
  styleUrls: ['./migration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MigrationComponent implements OnInit {
  rawData = '';
  parsedList: PreparedItem[];
  readyItems: LibraryItemV2[];

  ngOnInit(): void {
    if (localStorage.getItem(KEY_SAVE)) {
      const rawData = localStorage.getItem(KEY_SAVE);
      this.parsedList = JSON.parse(rawData);
    }
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

    this.parsedList = parsedList;

    localStorage.setItem(KEY_SAVE, JSON.stringify(parsedList));
  }
}
