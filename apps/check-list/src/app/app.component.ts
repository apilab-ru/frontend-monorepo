import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GroupPoints } from './interface';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AppComponent implements OnInit {
  points$: Observable<GroupPoints[]>;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.points$ = this.dataService.loadPoints();
  }
}
