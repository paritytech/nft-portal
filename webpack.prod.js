const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

export default merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
});
