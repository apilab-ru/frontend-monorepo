import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import * as fromRoot from "../../store/reducers";
import { Observable } from "rxjs";
import { Calc } from "../../models/calc";
import { Store } from "@ngrx/store";

@Component({
  selector: 'app-board-page',
  templateUrl: './board-page.component.html',
  styleUrls: ['./board-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardPageComponent implements OnInit {
  calculated$: Observable<Calc[]>;

  constructor(
    private store: Store,
  ) {
  }

  ngOnInit(): void {
    this.calculated$ = this.store.select(fromRoot.getCalcList);
  }

}
