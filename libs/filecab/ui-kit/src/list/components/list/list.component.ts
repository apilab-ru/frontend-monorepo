import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  TemplateRef,
  TrackByFunction
} from '@angular/core';
import { UiListIteratorDirective } from "../../list-iterator-directive";
import { OrderField } from "../../models/interface";
import { NgForOfContext } from "@angular/common";

@Component({
  selector: 'filecab-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiListComponent<T> {
  @Input() list: T[];
  @Input() orderFields: OrderField[];
  @Input() limitList: number[];

  @ContentChild(UiListIteratorDirective, { static: false }) private listIterator: UiListIteratorDirective<T>;

  get trackBy(): TrackByFunction<T> {
    return this.listIterator.listIteratorTrackBy;
  }

  get rowTemplate(): TemplateRef<NgForOfContext<T>> {
    return this.listIterator.template;
  }
}
