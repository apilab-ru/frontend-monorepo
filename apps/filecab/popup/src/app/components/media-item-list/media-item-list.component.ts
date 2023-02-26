import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { MediaItemV2 } from "@filecab/models/library";
import { Genre } from "@filecab/models/genre";

@Component({
  selector: 'popup-media-item-list',
  templateUrl: './media-item-list.component.html',
  styleUrls: ['./media-item-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaItemListComponent implements OnChanges {
  @Input() isLoading = true;
  @Input() isSearchMode = false;
  @Input() mediaItem?: MediaItemV2;
  @Input() list: MediaItemV2[];
  @Input() genres: Genre[];

  @Output() selectItem = new EventEmitter<MediaItemV2>();
  @Output() toSearchMode = new EventEmitter<void>();

  private isManual = false;

  ngOnChanges({ list, isSearchMode }: SimpleChanges): void {
    if ((list || isSearchMode) && this.list?.length === 1 && !this.isManual && this.isSearchMode) {
      setTimeout(() => {
        this.selectItem.emit(this.list[0]);
      })
    }
  }

  setSearchMode(): void {
    this.isManual = true;
    this.toSearchMode.emit();
  }
}
