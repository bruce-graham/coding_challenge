const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: path.join(__dirname, '/src/index.jsx'),

  output: {
    path: path.join(__dirname, '/public'),
    filename: 'bundle.js',
  },

  module: {
    loaders: [{
      test: /\.jsx?$/,
      include: path.join(__dirname, '/src'),
      loader: 'babel-loader',
      query: {
        presets: ["react", "es2015", "stage-2"],
      }
    }],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': Object.keys(process.env).reduce(function(o, k) {
        o[k] = JSON.stringify(process.env[k]);
        return o;
      }, {})
    })
  ],
};