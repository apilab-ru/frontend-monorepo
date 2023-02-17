import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';
import { MENU } from '../../routes';

@Component({
  selector: 'cabinet-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {
  menu = MENU;
}
