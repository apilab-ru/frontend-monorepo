import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { forwardRef } from "@angular/core";
import { UiFormControl } from "@ui-kit/form/form-control/form-control";

export const controlProvider = (component: any) => ([
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => component),
    multi: true
  },
  {
    provide: UiFormControl,
    useExisting: forwardRef(() => component),
    multi: true
  }
])