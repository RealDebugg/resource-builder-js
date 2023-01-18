var glob = require("glob");
const webpack = require('webpack');
const path = require('path');
const RemovePlugin = require('remove-files-webpack-plugin');
var WebpackObfuscator = require('webpack-obfuscator');

const buildPath = path.resolve(__dirname, 'dist');

const server = {
  entry: glob.sync('./src/server/**/*.js'),
  module: {
    rules: [
      {
        exclude: /node_modules/,
        use: { 
          loader: WebpackObfuscator.loader, 
          options: {
              rotateStringArray: true
          }
        }
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
    new RemovePlugin({
      before: {
        include: [
          path.resolve(buildPath, 'server')
        ]
      },
      watch: {
        include: [
          path.resolve(buildPath, 'server')
        ]
      }
    }),
    new WebpackObfuscator ({
      rotateStringArray: true
    })
  ],
  optimization: {
    minimize: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'server.js',
    path: __dirname + '/dist/'
  },
  target: 'node',
};

const client = {
  entry: glob.sync('./src/client/**/*.js'),
  module: {
    rules: [
      {
        exclude: /node_modules/,
        use: { 
          loader: WebpackObfuscator.loader, 
          options: {
              rotateStringArray: true
          }
        }
      },
    ],
  },
  plugins: [
    new RemovePlugin({
      before: {
        include: [
          path.resolve(buildPath, 'client')
        ]
      },
      watch: {
        include: [
          path.resolve(buildPath, 'client')
        ]
      }
    }),
    new WebpackObfuscator ({
      rotateStringArray: true
    })
  ],
  optimization: {
    minimize: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'client.js',
    path: __dirname + '/dist/'
  },
};

const shared = {
  entry: glob.sync('./src/shared/**/*.js'),
  module: {
    rules: [
      {
        exclude: /node_modules/,
        use: { 
          loader: WebpackObfuscator.loader, 
          options: {
              rotateStringArray: true
          }
        }
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
    new RemovePlugin({
      before: {
        include: [
          path.resolve(buildPath, 'shared')
        ]
      },
      watch: {
        include: [
          path.resolve(buildPath, 'shared')
        ]
      }
    }),
    new WebpackObfuscator ({
      rotateStringArray: true
    })
  ],
  optimization: {
    minimize: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'shared.js',
    path: __dirname + '/dist/'
  },
  target: 'node',
};

module.exports = [server, client, shared];