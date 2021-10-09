import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Work } from '../interfaces/work';

@Component({
  selector: 'app-item-work',
  templateUrl: './item-work.component.html',
  styleUrls: ['./item-work.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemWorkComponent {
  @Input() work: Work;
}
