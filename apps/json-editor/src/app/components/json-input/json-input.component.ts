import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { JsonDataService } from '../../services/json-data.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import example from '../../examples/example.json';

@Component({
  selector: 'je-json-input',
  templateUrl: './json-input.component.html',
  styleUrls: ['./json-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule],
})
export class JsonInputComponent {
  private readonly jsonDataService = inject(JsonDataService);
  private readonly router = inject(Router);

  async loadExample(): Promise<void> {
    const file = await this.jsonDataService.addFile(JSON.parse(JSON.stringify(example)), 'example.json');
    await this.router.navigate(['/edit', file.id]);
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
    };
    reader.readAsText(file);
  }
}
