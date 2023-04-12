import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  Input,
  QueryList,
  TemplateRef,
  TrackByFunction,
  ViewEncapsulation,
} from '@angular/core';
import { UiHeadComponent } from "@ui-kit/table/components/head/head.component";
import { UiTableIteratorDirective } from "@ui-kit/table/directives/iterator.directive";
import { NgForOfContext } from "@angular/common";

@Component({
  selector: 'ui-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTableComponent<T> {
  @Input() list: T[];

  @ContentChildren(UiHeadComponent) headerQueryList: QueryList<UiHeadComponent>;
  @ContentChild(UiTableIteratorDirective) private gridIterator: UiTableIteratorDirective<T>;

  get trackBy(): TrackByFunction<T> {
    return this.gridIterator.uiTableIteratorTrackBy;
  }

  get rowTemplate(): TemplateRef<NgForOfContext<T>> {
    return this.gridIterator.template;
  }

}
