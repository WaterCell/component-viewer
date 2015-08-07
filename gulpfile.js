var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');

var jeet = require('jeet');
var kouto = require("kouto-swiss");

var componentTester = require('./index');

gulp.task('components', function() {
  componentTester({
    scenarios: './test/scenarios/**/*.js',
    assets: './lib',
    preLoaders: [
      { test: /\.tag$/, loader: 'riotjs-loader', query: { type: 'es6' } },
    ],
    loaders: [
      { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' },
      { test: /src\/.*\.js$/, loader: 'babel-loader' },
    ],
    extensions: ['.styl', '.tag'],
    overrides: {
      plugins: [ new webpack.ProvidePlugin({ riot: 'riot' }) ],
      stylus: {
        use: [
          jeet(),
          kouto()
        ]
      }
    }
  });
});

var once = false;

gulp.task('once', function () {
  once = true;
});

gulp.task('test', function (done) {
  var karma = require('karma').server;
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: once
  }, done);
});

gulp.task('nightwatch', function() {
  var nightwatch = require('gulp-nightwatch');
  gulp.src('')
    .pipe(nightwatch({
      configFile: 'test/nightwatch.json',
      cliArgs: {
        env: 'default'
      }
    }))
    .on('error', gutil.log);
});

gulp.task('once', ['once', 'test']);
gulp.task('tdd', ['test']);

gulp.task('e2e', ['nightwatch']);

gulp.task('default', ['once']);

