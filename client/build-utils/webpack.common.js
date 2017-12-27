const commonPaths = require('./common-paths');

const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const config = {
  entry: {
    vendor: ['semantic-ui-react', 'firebase']
  },
  output: {
    path: commonPaths.outputPath,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/favicon.ico'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor'],
      minChunks: Infinity
    })
  ]
};

module.exports = config;
