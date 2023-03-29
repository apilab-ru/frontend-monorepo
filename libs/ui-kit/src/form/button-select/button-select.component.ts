import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { UiFormControl } from "@ui-kit/form/form-control/form-control";
import { controlProvider } from "@ui-kit/form/form-control/provider";

@Component({
  selector: 'ui-button-select',
  templateUrl: './button-select.component.html',
  styleUrls: ['./button-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ...controlProvider(UiButtonSelectComponent),
  ]
})
export class UiButtonSelectComponent<Value, T> extends UiFormControl<Value> {
  @Input() optionLabel = 'name';
  @Input() optionValue = 'value';
  @Input() ngModel: Value;
  @Input() options: T[];

  @Output() ngModelChange = new EventEmitter<Value>();
}
