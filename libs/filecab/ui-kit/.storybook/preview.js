import { applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFilecabTheme } from '../src/theme/prime-ng.providers';

export const decorators = [applicationConfig({ providers: [provideAnimations(), provideFilecabTheme()] })];

import { create } from 'storybook/theming';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  options: {
    theme: create({
      brandTitle: 'Shared',
      base: 'light',
    }),
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    inlineStories: true,
  },
};
