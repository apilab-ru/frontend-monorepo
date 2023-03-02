import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { LibraryItemV2 } from "@filecab/models/library";
import { Genre } from "@filecab/models/genre";
import isEqual from 'lodash-es/isEqual';
import cloneDeep from 'lodash-es/cloneDeep';
import { STATUS_LIST, STATUS_WITH_PROGRESS, STATUS_WITH_STARS } from "@filecab/models/status";

@Component({
  selector: 'filecab-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilecabCardComponent {
  @Input() item: LibraryItemV2;
  @Input() genres: Genre[];
  @Input() isLibraryMode = false;

  @Output() updateItem = new EventEmitter<LibraryItemV2>();
  @Output() deleteItem = new EventEmitter<void>();
  @Output() addItem = new EventEmitter<void>();
  @Output() clickGenre = new EventEmitter<number>();

  placeholder = 'assets/placeholder-loading.svg';
  placeholderError = 'assets/placeholder-error.svg';
  localItem: LibraryItemV2;
  isChanged = false;
  isEditMode = false;

  statuses = STATUS_LIST;
  statusWithProgress = STATUS_WITH_PROGRESS;
  statusWithStars = STATUS_WITH_STARS;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.item) {
      this.localItem = cloneDeep(this.item);
    }
  }

  onClickGenre(genreId: number): void {
    this.clickGenre.emit(genreId);
  }

  onSetStars(star: number): void {
    this.localItem.star = star;
    this.isChanged = this.checkIsChanged();
  }

  onSetProgress(progress: number): void {
    this.localItem.progress = progress;
    this.isChanged = this.checkIsChanged();
  }

  onSetStatus(status: string): void {
    this.localItem.status = status;
    this.isChanged = this.checkIsChanged();
  }

  onSetComment(comment: string): void {
    this.localItem.comment = comment;
    this.isChanged = this.checkIsChanged();
  }

  update(): void {
    this.isChanged = false;
    this.updateItem.emit(this.localItem);
    this.isEditMode = false;
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  private checkIsChanged(): boolean {
    return !isEqual(this.localItem, this.item);
  }
}
