// eslint-disable-next-line import/no-extraneous-dependencies
const merge = require('webpack-merge');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  devServer: {
    contentBase: './dist',
    hot: true,
  },
  devtool: 'cheap-eval-source-map',
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [{ loader: 'html-srcsets-loader', options: { minimize: false } }],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              outputPath: 'images',
            },
          },
        ],
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
});
