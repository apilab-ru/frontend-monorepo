import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MENU } from '../../routes';
import { JsonDataService } from '../../services/json-data.service';
import { map, Observable } from 'rxjs';
import { MenuItem } from '../../interface';

@Component({
  selector: 'je-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, RouterLink, RouterLinkActive],
})
export class MenuComponent implements OnInit {
  list$: Observable<MenuItem[]>;

  private readonly jsonDataService = inject(JsonDataService);

  ngOnInit(): void {
    this.list$ = this.jsonDataService.fileNames$.pipe(
      map((files) => {
        return [
          ...MENU,
          ...files.map(({ name, id }) => ({
            name,
            path: '/edit/' + id,
          })),
        ] as MenuItem[];
      })
    );
  }
}
