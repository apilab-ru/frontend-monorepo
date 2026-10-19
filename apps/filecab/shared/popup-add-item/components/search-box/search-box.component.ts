import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TYPES } from '@filecab/models/types';
import { of } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBoxComponent {
  @Input() form: FormGroup;

  types$ = of(TYPES);

  selectType(type: string): void {
    this.form.patchValue({ type });
  }

}
