import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef, TrackByFunction } from '@angular/core';
import { RowContext } from "@angular/cdk/table";
import { UiListIteratorDirective } from "../../list-iterator-directive";

@Component({
  selector: 'filecab-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiListComponent<T> {
  @Input() list: T[];

  @ContentChild(UiListIteratorDirective, { static: false }) private listIterator: UiListIteratorDirective<T>;

  get trackBy(): TrackByFunction<T> {
    return this.listIterator.listIteratorTrackBy;
  }

  get rowTemplate(): TemplateRef<RowContext<T>> {
    return this.listIterator.template;
  }

  private calcShowData(data: T[] | undefined, page: number, limit: number): T[] {
    if (!data) {
      return [];
    }

    const start = (page - 1) * limit;
    const end = page * limit;
    return data.slice(start, end);
  }
}
