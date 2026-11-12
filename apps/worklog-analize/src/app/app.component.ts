import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ROUTES } from './routes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, RouterLink, RouterLinkActive, RouterOutlet],
})
export class AppComponent {
  githubLink = 'https://github.com/apilab-ru/worklog-analize';
  menu = ROUTES;
}
