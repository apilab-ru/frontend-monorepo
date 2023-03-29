import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserService } from "@module/users/services/user.service";
import { Observable } from "rxjs";
import { CurrentUser } from "@module/users/models/interface";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  users$: Observable<CurrentUser[]>;

  constructor(
    private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.users$ = this.userService.loadAvailableUsers();
  }
}
