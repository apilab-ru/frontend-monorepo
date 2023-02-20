import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { Integration, IntegrationType } from "../../interfase";

@Component({
  selector: 'app-integration-edit',
  templateUrl: './integration-edit.component.html',
  styleUrls: ['./integration-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegrationEditComponent {
  constructor(
    private dialogRef: MatDialogRef<Integration, Integration>,
  ) {
  }

  formGroup = new FormGroup({
    apiKey: new FormControl('')
  })

  save(): void {
    const form = this.formGroup.getRawValue();
    this.dialogRef.close({
      ...form,
      type: IntegrationType.clockify,
    });
  }
}
