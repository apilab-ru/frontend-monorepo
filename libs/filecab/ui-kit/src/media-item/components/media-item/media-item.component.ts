import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MediaItemV2 } from "@filecab/models/library";
import { Genre } from "@filecab/models/genre";

@Component({
  selector: 'filecab-media-item',
  templateUrl: './media-item.component.html',
  styleUrls: ['./media-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaItemComponent implements OnChanges {
  @Input() mediaItem?: MediaItemV2;
  @Input() genres?: Genre[];

  showedGenres: Genre[];

  ngOnChanges({ mediaItem, genres }: SimpleChanges) {
    if ((mediaItem || genres) && (this.mediaItem && this.genres)) {
      this.showedGenres = this.genres?.filter(({ id }) => this.mediaItem?.genreIds.includes(id))
    }
  }
}