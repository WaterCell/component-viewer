var webpack = require('webpack');

var path = require("path");

var jeet = require('jeet');
var kouto = require("kouto-swiss");

var entry = {
  viewer: __dirname + '/src/viewer.js'
};


module.exports = {
  entry: entry,
  plugins: [ new webpack.ProvidePlugin({ riot: 'riot' }) ],
  stylus: { use: [ jeet(), kouto() ] },
  module: {
    preLoaders: [
      { test: /\.tag$/, loader: 'riotjs-loader', query: { type: 'es6' } },
    ],
    loaders: [
      { test: /\.jade$/, loader: "jade" },
      { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' },
      { test: /src\/.*\.js$/, loader: 'babel-loader' },
    ]
  },
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".js", ".jade", ".tag"]
  },
  output: {
    path: path.join(__dirname, "./lib"),
    filename: "[name].js",
    chunkFilename: "[id].chunk.js"
  }
}
