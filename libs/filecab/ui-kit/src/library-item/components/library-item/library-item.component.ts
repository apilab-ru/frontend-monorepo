import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

@Component({
  selector: 'filecab-library-item',
  templateUrl: './library-item.component.html',
  styleUrls: ['./library-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibraryItemComponent {
}
