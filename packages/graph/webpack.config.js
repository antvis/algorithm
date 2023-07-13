const resolve = require('path').resolve;

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'index.min.js',
    library: 'GraphAlgorithm',
    libraryTarget: 'umd',
    path: resolve(process.cwd(), 'dist'),
    globalObject: 'this',
    publicPath: '',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devtool: 'source-map',
};
