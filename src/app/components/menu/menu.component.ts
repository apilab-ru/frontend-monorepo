import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScrollNavigationService } from '../../services/scroll-navigation.service';
import { MENU } from './menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  sectionId$ = this.scrollNavigationService.sectionId$;
  menuList = MENU;

  constructor(
    private scrollNavigationService: ScrollNavigationService,
  ) {
  }

  scrollTo(sectionId: string): void {
    this.scrollNavigationService.scrollTo(sectionId);
  }
}
