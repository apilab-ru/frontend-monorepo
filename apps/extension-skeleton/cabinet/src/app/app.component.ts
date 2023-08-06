import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CabinetService } from "./services/cabinet.service";
import { User } from "@shared/user";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { UserService } from "@shared/user/services/user.service";

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  repos$ = this.cabinetService.repos$;
  counter$ = this.cabinetService.counter$;
  user$ = this.userService.user$;

  constructor(
    private cabinetService: CabinetService,
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.counter$.pipe(
      untilDestroyed(this)
    ).subscribe(count => console.log('xxx count', count))
  }

  updateUser(user: User): void {
    this.userService.updateUser(user).pipe(
      untilDestroyed(this)
    ).subscribe(() => {
      console.log('xxx user saved')
    })
  }

  increment(): void {
    this.cabinetService.increment();
  }

  decrement(): void {
    this.cabinetService.decrement();
  }
}
