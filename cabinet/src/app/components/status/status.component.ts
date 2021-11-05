import { ChangeDetectorRef, Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LibraryService } from '../../services/library.service';
import { Status } from '../../../api';
import { MatSelectChange } from '@angular/material/select';
import { FileCab } from '@shared/services/file-cab';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => StatusComponent), multi: true },
  ]
})
export class StatusComponent implements ControlValueAccessor {

  value: string;
  onChange: (status: string) => void;
  statusList: Status[];

  constructor(
    private libraryService: LibraryService,
    private changeDetector: ChangeDetectorRef,
    private fileCab: FileCab,
  ) {
    this.statusList = this.fileCab.statusList;
  }

  writeValue(status: string): void {
    this.value = status;
    setTimeout(() => {
      this.changeDetector.markForCheck();
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  handleChange(event: MatSelectChange): void {
    this.value = event.value;
    this.onChange(event.value);
  }

}
