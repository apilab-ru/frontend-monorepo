module.exports = {
  stories: ['../**/*.stories.ts', '../**/*.mdx'],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/angular',
  core: {
    disableTelemetry: true,
    builder: '@storybook/builder-webpack5',
  },
  features: {
    interactionsDebugger: true,
  },
};
