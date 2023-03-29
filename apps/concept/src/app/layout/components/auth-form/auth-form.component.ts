import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CurrentUser } from "@module/users/models/interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

enum Mode {
  auth = 'auth',
  reg = 'reg',
  demo = 'demo',
}

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormComponent {
  @Input() users: CurrentUser[] | null;

  form: FormGroup;
  mode = Mode.reg;
  Modes = Mode;
  variants = [
    {
      label: 'Auth',
      value: Mode.auth
    },
    {
      label: 'Registration',
      value: Mode.reg
    },
    {
      label: 'DemoAuth',
      value: Mode.demo
    }
  ];

  constructor(
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      email: ['Test', [Validators.email, Validators.required]],
      password: ['123', Validators.required],
    })

    console.log('xxx form', this.form);
  }
}
