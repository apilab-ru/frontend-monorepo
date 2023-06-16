import { Directive, Input, TemplateRef, TrackByFunction } from '@angular/core';
import { NgForOfContext } from "@angular/common";

@Directive({
  selector: '[uiTableIterator][uiTableIteratorOf]'
})
export class UiTableIteratorDirective<T> {

  @Input() uiTableIteratorTrackBy: TrackByFunction<T> = (index) => index;

  @Input() uiTableIteratorOf: T[];

  constructor(public template: TemplateRef<NgForOfContext<T>>) {
  }

}
