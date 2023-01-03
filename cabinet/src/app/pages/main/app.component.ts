import { ChangeDetectionStrategy, Component, OnInit, TemplateRef } from '@angular/core';
import { MENU_ITEMS } from '../../routing/menu-items';
import { LayoutService } from '../../services/layout.service';
import { BreakpointsService } from '../../services/breakpoints.service';
import { notificationsService } from '@shared/services/notifications.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private notificationsService = notificationsService;

  navLinks = MENU_ITEMS;
  template$: Observable<TemplateRef<any> | null>;
  isMobile$: Observable<boolean>;

  constructor(
    private layoutService: LayoutService,
    private breakpointService: BreakpointsService,
    private matSnackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.template$ = this.layoutService.template$.asObservable();
    this.isMobile$ = this.breakpointService.isMobile$;

    this.notificationsService
      .readMessages()
      .pipe(untilDestroyed(this))
      .subscribe(message => {
        this.matSnackBar.open(message, undefined, {
          duration: 3000,
        });
      });
  }
}
