import { componentWrapperDecorator, Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from "@angular/common";
import { ThemeColorsComponent } from "./theme-colors/theme-colors.component";

export default {
  title: 'Ui-kit / Theme',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, BrowserAnimationsModule, ThemeColorsComponent],
    }),
  ],
} as Meta;

export const ThemeDoc = () => ({
  template: `
    <div style="width: 90vw;">
        <filecab-theme-colors></filecab-theme-colors>
    </div>
  `
});