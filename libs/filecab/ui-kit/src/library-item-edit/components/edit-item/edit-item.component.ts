import {
  ChangeDetectionStrategy,
  Component, EventEmitter, Input, OnChanges, OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { Types, TYPES } from '@filecab/models/types';
import { Status, STATUS_LIST, STATUS_WITH_PROGRESS, STATUS_WITH_STARS } from '@filecab/models/status';
import { FormControl, FormGroup } from '@angular/forms';
import { MetaData } from '@filecab/models/meta-data';
import isEqual from 'lodash-es/isEqual';
import { debounceTime, filter } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MediaItem } from "@filecab/models";

@UntilDestroy()
@Component({
  selector: 'filecab-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditItemComponent implements OnChanges, OnInit {
  @Input() meta: MetaData;
  @Input() type: Types;
  @Input() name: string;
  @Input() mediaItem?: MediaItem;
  @Input() needShowSave = false;

  @Output() metaChange = new EventEmitter<MetaData>();
  @Output() typeChange = new EventEmitter<Types>();
  @Output() nameChange = new EventEmitter<string>();

  types = TYPES;
  statuses = STATUS_LIST;
  statusWithProgress = STATUS_WITH_PROGRESS;
  statusWithStars = STATUS_WITH_STARS;

  formMeta = new FormGroup({
    status: new FormControl<Status>(null),
    star: new FormControl<number>(0),
    comment: new FormControl(''),
    progress: new FormControl(0),
  });
  nameControl = new FormControl('');

  ngOnChanges({ meta, name }: SimpleChanges): void {
    if (meta) {
      this.formMeta.patchValue(meta.currentValue);
      this.meta = this.formMeta.getRawValue() as MetaData;
    }

    if (name) {
      this.nameControl.patchValue(name.currentValue);
    }
  }

  ngOnInit(): void {
    this.nameControl.valueChanges.pipe(
      debounceTime(300),
      filter(value => value !== this.name),
      untilDestroyed(this),
    ).subscribe(name => {
      this.nameChange.emit(name || '');
    })
  }

  onTypeUpdate(type: Types): void {
    if (type !== this.type) {
      this.typeChange.emit(type);
    }
  }

  isMetaChanged(value: MetaData): boolean {
    return !isEqual(value, this.meta);
  }

  saveMeta(): void {
    this.metaChange.emit(this.formMeta.getRawValue() as MetaData);
  }
}
