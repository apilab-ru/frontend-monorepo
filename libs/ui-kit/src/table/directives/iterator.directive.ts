import { Directive, Input, TemplateRef, type TrackByFunction } from '@angular/core';
import { NgForOfContext } from '@angular/common';

@Directive({
  selector: '[uiTableIterator][uiTableIteratorOf]',
  standalone: false,
})
export class UiTableIteratorDirective<T> {
  @Input() uiTableIteratorTrackBy: TrackByFunction<T> = (index) => index;

  @Input() uiTableIteratorOf: T[];

  constructor(public template: TemplateRef<NgForOfContext<T>>) {}
}
