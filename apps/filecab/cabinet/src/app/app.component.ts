import { ChangeDetectionStrategy, Component, OnInit, TemplateRef } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { LayoutService } from "./services/layout.service";

@UntilDestroy()
@Component({
  selector: 'cabinet-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  subMenuTemplate$ = this.layoutService.subMenuTemplate$;

  constructor(
    private layoutService: LayoutService,
  ) {
  }

  ngOnInit(): void {
    // this.subMenuTemplate$.subscribe(t => console.log('xxx t', t))
  }
}
