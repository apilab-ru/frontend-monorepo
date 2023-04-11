import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[uiTableTr]'
})
export class UiTableTrDirective implements OnInit {

  constructor(
    private elementRef: ElementRef<HTMLElement>,
  ) { }

  ngOnInit(): void {
    this.elementRef.nativeElement.classList.add('ui-table-tr')
  }
}
