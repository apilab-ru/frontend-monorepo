import type { StorybookConfig } from '@storybook/angular';

export const rootMain: StorybookConfig = {
  stories: [],
  addons: ['@storybook/addon-docs'],
};

export const framework = {
  name: '@storybook/angular',
  options: {},
};

export const docs = {
  autodocs: true,
};
