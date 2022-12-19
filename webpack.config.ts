import path from 'path';
import fs from 'fs';
import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import NodemonPlugin from 'nodemon-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';

declare const process: any, __dirname: any;

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const { NODE_ENV = 'production' }: any = process.env;

const copyEnv: any = fs.existsSync('./.env')
  ? [
      new CopyPlugin({
        patterns: [{ from: '.env' }]
      })
    ]
  : [];

const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

const configuration: Configuration = {
  devtool: 'eval-cheap-module-source-map',
  entry: [path.resolve(__dirname, 'src')],
  mode: NODE_ENV,
  watch: NODE_ENV === 'development',
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
  module: {
    rules: [
      {
        test: /\.tsx?$/,
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
    new CleanWebpackPlugin(),
    new ESLintPlugin({
      extensions: ['.tsx', '.ts', '.js']
    }),
    new NodemonPlugin({
      ignore: ['./node_modules'],
      verbose: true,
      delay: 500
    }),
    //new HardSourceWebpackPlugin(),
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
  stats: {
    errorDetails: true,
    children: true,
    warnings: true
  },
  ignoreWarnings: [
    /Critical dependency: require function is used/,
    /Critical dependency: the request of a dependency/
  ]
};

export default configuration;
