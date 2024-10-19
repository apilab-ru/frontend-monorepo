import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { ProjectCardComponent } from '../project-card/project-card.component';
import { Project } from '../interfaces/project';
import { provideTranslation } from '@shared/translations';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-modal-project',
  templateUrl: './modal-project.component.html',
  styleUrls: ['./modal-project.component.scss'],
  // @ts-ignore
  providers: [provideTranslation('modalProject', () => import.meta.webpackContext('./translation'))],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalProjectComponent {
  constructor(
    public dialogRef: MatDialogRef<ProjectCardComponent>,
    @Inject(MAT_DIALOG_DATA) public detail: Project,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
