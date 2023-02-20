import {
  ChangeDetectionStrategy,
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { Integration } from "../../interfase";


@Component({
  selector: 'app-integration-item',
  templateUrl: './integration-item.component.html',
  styleUrls: ['./integration-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegrationItemComponent {
  @Input() integration: Integration;
  @Input() disabled = false;

  @Output() remove = new EventEmitter<void>();
  @Output() export = new EventEmitter<void>();
}
