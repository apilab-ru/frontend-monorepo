import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MENU } from './routes';
import { Router } from "@angular/router";
import { BrowserApiService } from "./services/browser-api.service";
import { ParserSchemas } from "@filecab/parser/schemas";
import { filter, map } from "rxjs";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'popup-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  path = '#';
  menu = MENU;

  constructor(
    private router: Router,
    private browserApiService: BrowserApiService,
    private parserSchemas: ParserSchemas,
  ) {
  }

  ngOnInit(): void {
    this.browserApiService.getActiveTab().pipe(
      map(tab => {
        const { domain, url } = this.browserApiService.getTabLinks(tab);
        return this.parserSchemas.getParserSchema(domain, url);
      }),
      filter(Boolean),
      untilDestroyed(this)
    ).subscribe({
      next: schema => {
        this.onNavigate('search');
      },
      error: () => {
        this.onNavigate('search');
      }
    })
  }

  onNavigate(path: string): void {
    if (this.path === path) {
      return;
    }

    this.path = path;

    if (path.indexOf('/') === 0) {
      window.open(path, '-blank')
    } else {
      this.router.navigateByUrl(path);
    }
  }
}
