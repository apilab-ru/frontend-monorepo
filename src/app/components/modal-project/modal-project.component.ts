import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProjectCardComponent } from '../project-card/project-card.component';

@Component({
  selector: 'app-modal-project',
  templateUrl: './modal-project.component.html',
  styleUrls: ['./modal-project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalProjectComponent {

  constructor(
    public dialogRef: MatDialogRef<ProjectCardComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
