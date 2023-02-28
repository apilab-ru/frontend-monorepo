import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LibraryItemV2 } from "@filecab/models/library";

@Component({
  selector: 'cabinet-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  @Input() item: LibraryItemV2;
}
