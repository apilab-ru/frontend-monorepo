import { ChangeDetectionStrategy, Component } from '@angular/core';
import { JsonDataService } from "../../services/json-data.service";

@Component({
  selector: 'je-json-input',
  templateUrl: './json-input.component.html',
  styleUrls: ['./json-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonInputComponent {
  constructor(
    private jsonDataService: JsonDataService,
  ) {
  }

  fileChange(target: EventTarget | null): void {
    const files = (target as HTMLInputElement)?.files;
    const file = files?.length && files[0];

    if (file) {
      this.handleChangeFile(file);
    }
  }

  private handleChangeFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent) => {
      const res = JSON.parse((event as any).target['result']);
      this.jsonDataService.addFile(res, file.name);
    }
    reader.readAsText(file);
  }

}
