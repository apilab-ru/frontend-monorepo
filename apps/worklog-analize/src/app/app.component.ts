import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IconComponent } from './components/icon.component';
import { ThemeService } from './services/theme.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ROUTES } from './routes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RouterLink, RouterLinkActive, RouterOutlet],
})
export class AppComponent {
  theme = inject(ThemeService);
  githubLink = 'https://github.com/apilab-ru/worklog-analize';
  menu = ROUTES;
}
