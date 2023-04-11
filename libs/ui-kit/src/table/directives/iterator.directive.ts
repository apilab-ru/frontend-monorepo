import { Directive, Input, TemplateRef, TrackByFunction } from '@angular/core';
import { NgForOfContext } from "@angular/common";

@Directive({
  selector: '[uiTableIterator][uiTableIteratorOf]'
})
export class UiTableIteratorDirective<T> {

  @Input() uiTableIterator: TrackByFunction<T>;

  @Input() uiTableIteratorOf: T[];

  constructor(public template: TemplateRef<NgForOfContext<T>>) {
  }

}
