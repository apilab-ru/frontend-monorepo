import { BoardPageComponent } from '../board/components/board-page/board-page.component';
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BoardPageComponent],
})
export class AppComponent {}
