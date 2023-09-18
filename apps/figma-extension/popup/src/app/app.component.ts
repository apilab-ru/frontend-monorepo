import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
  isRuleLoaded$ = this.backgroundService.select('config').pipe(map(config => !!config.rules));

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

  loadConfig(): void {
    this.backgroundService.reduce('config', 'loadConfig')(undefined).subscribe({
      next: () => this.uiMessageService.success({
        summary: `Загружен`
      }),
      error: summary => this.uiMessageService.error({
        summary
      })
    });
  }

  private convertToRhythm(value: string): string {
    return value.replace(/([0-9]+)px/g, res => `rhythm(${parseInt(res) / 4})`);
  }
}
