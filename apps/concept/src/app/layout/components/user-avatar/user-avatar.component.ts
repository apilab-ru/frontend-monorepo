import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from "../../../users/models/interface";

// dump component
@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAvatarComponent {
  @Input() user: User;
}
