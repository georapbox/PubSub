var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require('path');
var env = require('yargs').argv.mode;
var pkg = require('./package.json');

var libraryName = 'PubSub';

var banner = pkg.name + ' - ' + pkg.description + '\n\n' +
  '@version v' + pkg.version + '\n' +
  '@author ' + pkg.author + '\n' +
  '@homepage ' + pkg.homepage + '\n' +
  '@repository ' + pkg.repository.url;

var outputFile;

var plugins = [
  new webpack.BannerPlugin(banner)
];

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({minimize: true}));
  outputFile = 'pubsub.min.js';
} else {
  outputFile = 'pubsub.js';
}

module.exports = {
  entry: __dirname + '/src/pubsub.js',
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js']
  },
  plugins: plugins
};
