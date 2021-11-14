import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { ProjectDetails } from '../interfaces/project';
import { PROJECT_DETAILS } from '../../portfolio';

@Component({
  selector: 'app-modal-project',
  templateUrl: './modal-project.component.html',
  styleUrls: ['./modal-project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalProjectComponent {
  detail: ProjectDetails;

  constructor(
    public dialogRef: MatDialogRef<ProjectCardComponent>,
    @Inject(MAT_DIALOG_DATA) projectId: string,
  ) {
    this.detail = PROJECT_DETAILS[projectId];
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
