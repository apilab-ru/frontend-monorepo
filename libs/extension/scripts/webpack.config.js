const path = require('path');

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
    plugins: [],
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        options: {},
      },
    ],
  },
};
