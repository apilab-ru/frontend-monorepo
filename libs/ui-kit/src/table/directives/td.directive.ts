import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[uiTableTd]'
})
export class UiTableTdDirective implements OnInit {

  constructor(
    private elementRef: ElementRef<HTMLElement>,
  ) { }

  ngOnInit(): void {
    this.elementRef.nativeElement.classList.add('ui-table-td')
  }

}
