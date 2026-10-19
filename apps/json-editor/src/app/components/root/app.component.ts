import { RouterOutlet } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'je-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MenuComponent, RouterOutlet],
})
export class AppComponent {}
