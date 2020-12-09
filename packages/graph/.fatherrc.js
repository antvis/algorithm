export default {
  entry: './src/index.ts',
  esm: 'babel',
  cjs: 'babel',
  umd: {
    minFile: true,
    file: 'index'
  }
};