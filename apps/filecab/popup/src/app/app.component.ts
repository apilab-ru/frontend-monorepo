import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MENU } from './routes';

@Component({
  selector: 'popup-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  path = '#';
  menu = MENU;

  onNavigate(path: string): void {
    if (this.path === path) {
      return;
    }

    this.path = path;

    if (path.indexOf('/') === 0) {
      window.open(path, '-blank')
    }
  }
}
