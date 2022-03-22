const webpack = require('webpack');
const resolve = require('path').resolve;

module.exports = {
  entry: {
    index: './src/index.ts',
  },
  output: {
    filename: '[name].min.js',
    library: 'WebGPUGraph',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: resolve(process.cwd(), 'dist/'),
    globalObject: 'this',
    publicPath: './dist',
  },
  watchOptions: {
    ignored: /node_modules/
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.worker\.ts$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'worker-loader',
            options: {
              inline: 'fallback',
              filename: 'index.worker.js',
            },
          },
        ],
      },
      {
        test: /\.js$/,
        include: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  loose: true,
                  modules: false,
                },
              ],
              {
                plugins: ['@babel/plugin-proposal-class-properties'],
              },
            ],
          },
        },
      },
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },
  plugins: [new webpack.NoEmitOnErrorsPlugin(), new webpack.optimize.AggressiveMergingPlugin()],
  devtool: 'source-map',
};
