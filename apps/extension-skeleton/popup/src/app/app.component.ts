import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BrowserApiService } from "./services/browser-api.service";
import { BackgroundService } from "@background";
import { map } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  counter$ = this.backgroundService.select('test').pipe(
    map(data => data.counter)
  )

  constructor(
    private browserApiService: BrowserApiService,
    private backgroundService: BackgroundService
  ) {
  }

  ngOnInit(): void {
    console.log('xxx start');

    this.browserApiService.getActiveTab().then(tab => {
      console.log('xxx tab', tab);

      return this.browserApiService.executeScriptOnTab(tab.id!, this.readDocumentTitle)
    }).then(res => {
       console.log('xxx document title', res);
    }).catch(err => {
      console.error('error', err)
    })
  }

  increment(): void {
    this.backgroundService.reduce('test', 'increment')('');
  }

  decrement(): void {
    this.backgroundService.reduce('test', 'decrement')('');
  }

  private readDocumentTitle = (): string | null => {
    const title = document.title;
    return title || null;
  }
}
