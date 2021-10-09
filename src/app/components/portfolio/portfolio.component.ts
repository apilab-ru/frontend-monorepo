import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROJECTS_PREVIEW } from './const';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioComponent {
  projects = PROJECTS_PREVIEW;
}
