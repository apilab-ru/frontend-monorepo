import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { User } from "../../interface";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'shared-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent implements OnChanges {
  @Input() user: User | undefined | null;

  @Output() userChange = new EventEmitter<User>();

  form = this.makeForm();

  constructor(
    private fb: FormBuilder,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.form.patchValue(this.user || {}, { emitEvent: false });
  }

  save(): void {
    this.userChange.emit(
      this.form.getRawValue()
    );
  }

  private makeForm(): FormGroup {
    return this.fb.group<User>({
      name: '',
      git: '',
    })
  }
}
