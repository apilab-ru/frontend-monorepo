import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BackgroundService } from "@background";
import { map } from "rxjs";
import { UiMessagesService } from "@ui-kit/messages/messages.service";

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
    private backgroundService: BackgroundService,
    private uiMessageService: UiMessagesService,
  ) {
  }

  toggleEnable(isEnable: boolean): void {
    this.backgroundService.reduce('config', 'update')({ enabled: isEnable });
  }

  toggleReload(reloadEnable: boolean): void {
    this.backgroundService.reduce('config', 'update')({ reloadEnable });
  }

  convertAndCopy(value: string): void {
    const converted = this.convertToRhythm(value);
    navigator.clipboard.writeText(converted);

    this.uiMessageService.success({
      summary: `Скопировано: ${converted}`
    })
  }

  convertToRhythm(value: string): string {
    return value.replaceAll(/([0-9]+)px/g, res => `rhythm(${res[1]})`);
  }
}
