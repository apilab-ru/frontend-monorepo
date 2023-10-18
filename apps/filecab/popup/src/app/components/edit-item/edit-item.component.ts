import {
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';
import {
  Observable,
} from 'rxjs';
import { Types } from '@filecab/models/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FileCabService } from "@shared/services/file-cab.service";
import { MediaItemV2 } from "@filecab/models/library";
import { MetaDataV2 } from "@filecab/models/meta-data";
import { Genre } from "@filecab/models/genre";
import { UiMessagesService } from "@ui-kit/messages/messages.service";
import { EditContext } from "../../services/edit-context";

@UntilDestroy()
@Component({
  selector: 'popup-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditItemComponent implements OnInit {
  type$ = this.context.type$;
  name$ = this.context.name$;
  metaData$ = this.context.metaData$;
  mediaItem$ = this.context.mediaItem$
  isLoadingMeta$ = this.context.isLoadingMeta$;
  isLoadingList$ = this.context.isLoadingList$;
  isSearchMode$ = this.context.isSearchMode$;
  hasChanges$ = this.context.hasChanges$;
  isAvailable$ = this.context.isAvailable$;

  mediaResultList$: Observable<MediaItemV2[] | undefined>;
  genres$: Observable<Genre[]>;

  constructor(
    private uiMessageService: UiMessagesService,
    private filecabService: FileCabService,
    private context: EditContext,
  ) {
  }

  ngOnInit(): void {
    this.context.init().pipe(
      untilDestroyed(this)
    ).subscribe();

    this.genres$ = this.filecabService.genres$;
    this.mediaResultList$ = this.context.buildMediaList();

    //this.mediaResultList$.subscribe(res => console.log('list', res))
  }

  setSearchMode(isSearchMode: boolean): void {
    this.context.setSearchMode(isSearchMode);
  }

  onSelectItem(item: MediaItemV2): void {
    this.context.selectItem(item);
  }

  onTypeChange(type: Types): void {
    this.context.setType(type);
  }

  onNameChange(name: string): void {
    this.context.setName(name);
  }

  onSaveItem(meta: Partial<MetaDataV2>): void {
    this.context.saveItem(meta);
  }
}
