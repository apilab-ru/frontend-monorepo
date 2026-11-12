import { FormsModule } from '@angular/forms';
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
})
export class HelpComponent {
  domain = signal('jira.skyeng.tech');
}
