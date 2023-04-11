import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'ui-table-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiHeadComponent {
  @Input() class: string;

  @ViewChild('templateRef', { static: true }) templateRef: TemplateRef<HTMLElement>;
}
