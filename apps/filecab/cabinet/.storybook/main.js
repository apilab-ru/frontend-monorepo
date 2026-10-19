module.exports = {
  stories: ['../../../../libs/filecab/ui-kit/src/**/*.stories.ts'],
  addons: [
    '@storybook/addon-essentials',
  ],
  framework: { name: '@storybook/angular', options: {} },
  core: {
    disableTelemetry: true,
    builder: '@storybook/builder-webpack5',
  },
  features: {
    interactionsDebugger: true,
  },
};
