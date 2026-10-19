import { applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeuix/themes/lara';

export const decorators = [
  applicationConfig({
    providers: [provideAnimations(), providePrimeNG({ theme: { preset: Lara, options: { darkModeSelector: false } } })],
  }),
];

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
