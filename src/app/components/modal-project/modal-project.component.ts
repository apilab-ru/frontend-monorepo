import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-project',
  templateUrl: './modal-project.component.html',
  styleUrls: ['./modal-project.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalProjectComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
