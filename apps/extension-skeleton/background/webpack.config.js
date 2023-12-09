const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');
const getEnvTsConfig = require('../../../libs/extension/background/src/scripts/webpack-env.plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, './src'),
  entry: {
    background: ['./background.ts'],
  },
  output: {
    filename: '[name].js',
    path: __dirname + '../../dist',
  },
  target: 'webworker',
  resolve: {
    plugins: [new TsconfigPathsPlugin({
      configFile: getEnvTsConfig(__dirname),
    })],
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        options: {
          configFile: getEnvTsConfig(__dirname),
        },
      },
    ],
  },
};
