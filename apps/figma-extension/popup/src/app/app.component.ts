import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BackgroundService } from "@background";
import { map } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  isEnable$ = this.backgroundService.select('config').pipe(map(config => !!config.enabled));
  isReload$ = this.backgroundService.select('config').pipe(map(config => !!config.reloadEnable));

  constructor(
    private backgroundService: BackgroundService
  ) {
  }

  toggleEnable(isEnable: boolean): void {
    this.backgroundService.reduce('config', 'update')({ enabled: isEnable });
  }

  toggleReload(reloadEnable: boolean): void {
    this.backgroundService.reduce('config', 'update')({ reloadEnable });
  }
}
