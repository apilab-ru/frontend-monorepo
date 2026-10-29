import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-format-example',
  templateUrl: './format-example.component.html',
  styleUrls: ['./format-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormatExampleComponent {}
