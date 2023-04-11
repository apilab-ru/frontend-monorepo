module.exports = {
  stories: ['../src/**/*.stories.@(mdx|ts)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook-source-code-addon',
  ],
  framework: '@storybook/angular',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  features: {
    interactionsDebugger: true,
  },
};
