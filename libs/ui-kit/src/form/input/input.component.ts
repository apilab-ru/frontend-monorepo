import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor} from "@angular/forms";
import { UiFormControl } from "@ui-kit/form/form-control/form-control";
import { controlProvider } from "@ui-kit/form/form-control/provider";

@Component({
  selector: 'ui-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ...controlProvider(UiInputComponent),
  ]
})
export class UiInputComponent extends UiFormControl<string> {
  @Input() label: string | null = null;
  @Input() help: string;
  @Input() type: 'text' | 'password' = 'text';
}
