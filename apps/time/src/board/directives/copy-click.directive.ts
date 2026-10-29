import { Directive, HostListener, input, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Directive({ selector: '[appCopyClick]' })
export class CopyClickDirective {
  private snackBar = inject(MatSnackBar);

  appCopyClick = input.required<string>();

  @HostListener('click', ['$event']) onClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.copy(this.appCopyClick());
    this.snackBar.open(`Copped: ${this.appCopyClick()}`, 'Hide', {
      duration: 20_000,
    });
  }

  copy(str: string): void {
    const tmp = document.createElement('INPUT');
    const focus = document.activeElement;

    tmp['value'] = str;

    document.body.appendChild(tmp);
    tmp['select']();
    document.execCommand('copy');
    document.body.removeChild(tmp);
    focus['focus']();
  }
}
