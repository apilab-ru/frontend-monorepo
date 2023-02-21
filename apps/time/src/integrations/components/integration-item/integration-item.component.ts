import {
  ChangeDetectionStrategy,
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { IntegrationClockify } from "../../interfase";


@Component({
  selector: 'app-integration-item',
  templateUrl: './integration-item.component.html',
  styleUrls: ['./integration-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegrationItemComponent {
  @Input() integration: IntegrationClockify;
  @Input() disabled = false;

  @Output() remove = new EventEmitter<void>();
  @Output() export = new EventEmitter<void>();
}
