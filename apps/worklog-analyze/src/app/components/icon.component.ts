import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `<span class="app-icon" aria-hidden="true" [style.--icon]="'url(assets/icons/' + name() + '.svg)' "></span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  name = input.required<string>();
}
