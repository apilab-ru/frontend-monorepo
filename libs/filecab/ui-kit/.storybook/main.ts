import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../**/*.stories.ts', '../**/*.mdx'],
  addons: ['@storybook/addon-docs'],
  framework: { name: '@storybook/angular', options: {} },
  core: {
    disableTelemetry: true,
    builder: '@storybook/builder-webpack5',
  },
};

export default config;
