import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { Project } from '../interfaces/project';
import { provideTranslation } from '../../libs/translate';

@Component({
  selector: 'app-modal-project',
  templateUrl: './modal-project.component.html',
  styleUrls: ['./modal-project.component.scss'],
  providers: [provideTranslation('modalProject', () => require.context('./translation'))],
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
