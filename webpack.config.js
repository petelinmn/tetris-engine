const path = require('path');

module.exports = {
  entry: './test/index.js',
  output: {
    path: path.resolve(__dirname, 'test/build'),
    filename: 'bundle.js',
    library: 'tetris-engine',
    libraryTarget: 'umd'
  },
  mode: 'development',
  devtool: 'source-map'
};