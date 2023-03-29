import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserService } from "../../../users/services/user.service";
import { EMPTY, finalize, Observable, switchMap } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { AuthComponent } from "../auth/auth.component";

// dump component
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
  constructor(
    private userService: UserService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.userService.user$.subscribe(user => console.log('xxx user', user))

    this.userService.user$.pipe(
      switchMap(user => !!user ? EMPTY : this.openAuthModal())
    ).subscribe()
  }

  private openAuthModal(): Observable<void> {
    const ref = this.dialog.open(AuthComponent);

    return ref.afterClosed().pipe(
      finalize(() => ref.close())
    )
  }
}
