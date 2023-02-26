import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cabinet-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {}
