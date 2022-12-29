import path from 'path';
import fs from 'fs';
import { Configuration as WebpackConfiguration } from 'webpack';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import NodemonPlugin from 'nodemon-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';

declare const process: any, __dirname: any;

const mode: any = process.env.NODE_ENV ?? 'development';

const copyEnv: any = fs.existsSync('./.env')
  ? [
      new CopyPlugin({
        patterns: [{ from: '.env' }]
      })
    ]
  : [];

const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

const configuration: WebpackConfiguration = {
  mode,
  devtool: 'eval-cheap-module-source-map',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js',
    clean: true
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()]
  },
  stats: 'minimal',
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.hbs?$/,
        use: 'handlebars-loader'
      }
    ]
  },
  externals: [nodeExternals()],
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          compress: {
            unused: false,
            drop_console: true,
            collapse_vars: true,
            reduce_vars: true
          },
          mangle: true,
          output: {
            comments: false
          }
        }
      })
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new NodemonPlugin({
      ignore: ['src/**/*.spec.ts']
    }),
    new ESLintPlugin({
      extensions: ['.ts', '.js']
    }),
    new ParallelUglifyPlugin({
      uglifyJS: {
        output: {
          beautify: false,
          comments: false
        },
        compress: {
          drop_console: true,
          collapse_vars: true,
          reduce_vars: true
        }
      }
    }),
    ...copyEnv
  ],
  ignoreWarnings: [/Critical dependency:/]
};

export default configuration;
