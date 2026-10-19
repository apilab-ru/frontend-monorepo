import { applicationConfig, Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { UiInputModule } from './input.module';

const meta: Meta = {
  title: 'Form / Input',
  decorators: [
    moduleMetadata({ imports: [UiInputModule, ReactiveFormsModule] }),
    applicationConfig({ providers: [provideAnimations()] }),
  ],
  render: args => ({
    template: `<div style="max-width: 300px">
      <ui-input [label]="label" [help]="help" [formControl]="formControl"></ui-input>
    </div>`,
    props: {
      ...args,
      formControl: new FormControl('Test', [Validators.required, Validators.minLength(5)]),
    },
  }),
};
export default meta;

export const Default: StoryObj = {
  args: { label: 'Username', help: 'Enter your username to reset your password.' },
};
