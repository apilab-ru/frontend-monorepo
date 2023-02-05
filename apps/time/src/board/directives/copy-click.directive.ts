import { Directive, HostListener, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Directive({
  selector: '[appCopyClick]'
})
export class CopyClickDirective {

  @Input() appCopyClick: string;

  @HostListener('click', ['$event']) onClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.copy(this.appCopyClick);
    this.snackBar.open(`Copped: ${this.appCopyClick}`, null, {
      duration: 20000
    });
  }

  constructor(private snackBar: MatSnackBar) {
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
