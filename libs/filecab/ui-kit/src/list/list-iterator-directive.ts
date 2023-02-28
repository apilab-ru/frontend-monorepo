import { Directive, Input, TemplateRef, TrackByFunction } from '@angular/core';
import { NgForOfContext } from "@angular/common";

export interface RowContext<T> {
  $implicit: T;
}

@Directive({
  selector: '[listIterator][listIteratorOf]',
})
export class UiListIteratorDirective<T> {
  @Input() listIterator: TrackByFunction<T>;
  @Input() listIteratorOf: T[];
  @Input() listIteratorTrackBy: (index: number, item: T) => number;

  constructor(public template: TemplateRef<NgForOfContext<T>>) {
  }

}
