import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[uiTableTd]',
  standalone: false,
})
export class UiTableTdDirective implements OnInit {
  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.elementRef.nativeElement.classList.add('ui-table-td');
  }
}
