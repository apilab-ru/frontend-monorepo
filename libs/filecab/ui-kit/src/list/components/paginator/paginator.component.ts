import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'filecab-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiPaginatorComponent {}
