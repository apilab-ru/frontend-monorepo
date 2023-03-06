import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA, MatLegacyDialogRef } from '@angular/material/legacy-dialog';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { Project } from '../interfaces/project';
import { provideTranslation } from '../../libs/translate';

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
    public dialogRef: MatLegacyDialogRef<ProjectCardComponent>,
    @Inject(MAT_LEGACY_DIALOG_DATA) public detail: Project,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
