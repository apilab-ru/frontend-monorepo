import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Project } from '../interfaces/project';
import { MatDialog } from '@angular/material/dialog';
import { ModalProjectComponent } from '../modal-project/modal-project.component';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent {
  @Input() project: Project;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalProjectComponent);
  }
}
