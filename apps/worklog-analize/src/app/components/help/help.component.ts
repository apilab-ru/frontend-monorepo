import { FormsModule } from '@angular/forms';
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconComponent } from '../icon.component';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, IconComponent],
})
export class HelpComponent {
  domain = signal('jira.skyeng.tech');

  private snackBar = inject(MatSnackBar);

  async copyScript(script: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(script);
    } catch {
      this.snackBar.open('Could not copy the script. Please try again.', 'Dismiss');
    }
  }
}
