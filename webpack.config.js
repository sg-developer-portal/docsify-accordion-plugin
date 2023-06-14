const path = require('path');
const TerserWebpackPlugin = require('terser-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const pluginName = 'docsify-accordion-plugin';

module.exports = {
  mode: 'production',
  watch: process.env.WATCH === 'true' || false,
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  entry: {
    [pluginName]: [path.join(process.cwd(), 'src', 'index.ts')],
    [pluginName + '.min']: [path.join(process.cwd(), 'src', 'index.ts')]
  },
  output: {
    path: path.join(process.cwd(), 'dist'),
    filename: '[name].js',
    library: 'DocsifyPluginToc',
    libraryTarget: 'umd',
    libraryExport: 'default',
    sourceMapFilename: '[file].map',
    globalObject: 'this'
  },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        include: /\.min\.js$/,
        parallel: true,
        extractComments: false,
        terserOptions: {
          format: {
            comments: false
          },
          compress: true,
          ie8: false,
          ecma: 5,
          warnings: false
        }
      })
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'accordion.css'
    })
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: path.join(process.cwd(), 'src', 'assets', 'accordion.css'),
    //       to: path.join(process.cwd(), 'dist', 'accordion.css')
    //     }
    //   ]
    // })
  ]
};
