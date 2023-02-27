import { Directive, HostListener, Input } from '@angular/core';
import { Clipboard } from "@angular/cdk/clipboard";

@Directive({
  selector: '[uiCopyClick]',
  standalone: true,
})
export class UiCopyClickDirective {
  @Input() uiCopyClick: string;

  @HostListener('click', ['$event']) onClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.copy(this.uiCopyClick);
  }

  constructor(
    private clipboard: Clipboard,
  ) { }

  private copy(text: string): void {
    this.clipboard.copy(text);
  }

}
