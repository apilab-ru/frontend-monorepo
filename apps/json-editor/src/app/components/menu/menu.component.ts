import type { MenuItem } from '../../interface';
import type { Signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MENU } from '../../routes';
import { JsonDataService } from '../../services/json-data.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'je-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
})
export class MenuComponent {
  list = this.createList();

  private jsonDataService = inject(JsonDataService);
  private files = toSignal(this.jsonDataService.fileNames$, { initialValue: [] });

  private createList(): Signal<MenuItem[]> {
    return computed(() => [
      ...MENU,
      ...this.files().map(({ name, id }) => ({
        name,
        path: '/edit/' + id
      })),
    ]);
  }
}
