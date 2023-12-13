import type { StorybookConfig } from '@storybook/core-common';

export const rootMain: StorybookConfig = {
  stories: [],
  addons: ['@storybook/addon-essentials'],
};

export const framework = {
  name: '@storybook/angular',
  options: {}
};

export const docs = {
  autodocs: true
};
