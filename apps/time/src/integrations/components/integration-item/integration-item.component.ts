import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Integration } from '../../interface';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-integration-item',
  templateUrl: './integration-item.component.html',
  styleUrls: ['./integration-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTooltip, MatButton],
})
export class IntegrationItemComponent {
  integration = input.required<Integration>();
  disabled = input(false);

  remove = output<void>();
  export = output<void>();
}
