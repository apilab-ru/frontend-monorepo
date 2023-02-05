import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MENU } from "../../routes";
import { JsonDataService } from "../../services/json-data.service";
import { map, Observable } from "rxjs";
import { MenuItem } from "../../interface";

@Component({
  selector: 'je-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit {
  list$: Observable<MenuItem[]>;

  constructor(
    private jsonDataService: JsonDataService,
  ) {
  }

  ngOnInit(): void {
    this.list$ = this.jsonDataService.fileNames$.pipe(
      map(files => {
        return [...MENU, ...files.map(({name, id}) => ({
          name,
          path: '/edit/' + id
        }))] as MenuItem[]
      })
    );
  };
}
