import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { of, Observable } from 'rxjs';
import { LIST_POINTS } from "./const";
import { GroupPoints } from "./interface";
import { DataService } from "./services/data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  points$: Observable<GroupPoints[]>;

  constructor(
    private dataService: DataService,
  ) {
  }

  ngOnInit(): void {
    this.points$ = this.dataService.loadPoints();
  }
}
