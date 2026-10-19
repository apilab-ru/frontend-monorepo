module.exports = {
  stories: ["../**/*.stories.ts", "../**/*.mdx"],
  addons: [
    "@storybook/addon-essentials",
  ],
  framework: "@storybook/angular",
  core: {
    disableTelemetry: true,
    builder: "@storybook/builder-webpack5",
  },
  features: {
    interactionsDebugger: true,
  },
};
