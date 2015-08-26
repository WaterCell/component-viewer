var _ = require('lodash');
var webpack = require('webpack');
var imports = require('imports-loader');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var fs = require('fs');
var path = require("path");
var glob = require('glob');

var express = require('express')
var serveStatic = require('serve-static')


function buildImportString(components, styles) {
  var result = "imports?components=>" + encodeURIComponent(JSON.stringify(components))
  result += "&styles=>" + encodeURIComponent(JSON.stringify(styles));
  result += "&modules=>" + encodeURIComponent('{}');
  var modules = '[';
  _.each(components, function(component) {
    var p = path.join(component.dir, component.base);
    result += "&component" + component.idx + "=" + component.full;
    modules += ("require('"+component.full+"'),");
  });
  modules = modules.slice(0,-1);
  result += "&modules=>" + encodeURIComponent(modules + ']');

  return result;
}

function build_config(opts, entry, extra_loaders, extra_preLoaders) {
  var default_extensions = ["", ".webpack.js", ".web.js", ".js"];

  var loaders = (extra_loaders || []).concat(opts.loaders || []);
  var preLoaders = (extra_preLoaders || []).concat(opts.preLoaders || []);

  var options = {
    entry: entry,
    resolveLoader: {
      modulesDirectories: ["web_loaders", "web_modules", "node_loaders", "node_modules", __dirname + "/node_modules"],
    },
    module: {
      preLoaders: preLoaders,
      loaders: loaders
    },
    watch: true,
    resolve: {
      extensions: _.uniq(default_extensions.concat(opts.extensions || []))
    },
    output: {
      path: path.join(__dirname, ".tmp/"),
      filename: "[name].js",
      chunkFilename: "[id].chunk.js"
    }
  };

  _.assign(options, opts.overrides);

  return options;
}

function start_browserSync(watch, styles, assets, port) {
  browserSync({
    ui: false,
    open: false,
    files: _.flattenDeep([].concat(watch || [], styles || [], (assets && assets + '**/*') || [])),
    port: port || 3000,
    snippetOptions: {
      blacklist: ['/viewer.html', 'index.html']
    },
    server:{
      baseDir: _.flattenDeep([__dirname + '/.tmp/', __dirname + '/lib', __dirname + '/lib/assets', assets])
    }
  });

}

function start_express(watch, styles, assets, port) {

  var app = express()
  port = port || 3000;

  app.use(serveStatic(__dirname + '/.tmp/'))
  app.use(serveStatic(__dirname +'/lib'))
  app.use(serveStatic(__dirname +'/lib/assets'))
  app.use(serveStatic(assets))

  app.listen(port)
  console.log('start listening on http://localhost:' +port);

}



function map_styles(styles, assets) {
  var resolved_styles = [];
  if (_.isArray(styles)) {
    _.each(styles, function(path) {
      resolved_styles = styles.concat(glob.sync(path));
    });
  } else if(styles) {
    resolved_styles = glob.sync(styles);
  }
  return _.map(resolved_styles, function (p) {
    return path.relative(assets || process.cwd(), p);
  });
}

function resolve_components(scenarios, entry, components) {
  var scenario_files = glob.sync(scenarios);

  var pathLengths = _.map(scenario_files, function(name) {
    return path.resolve(path.parse(name).dir).split(path.sep).length;
  });
  var shortestPath = _.min(pathLengths) -1;

  _.each(scenario_files, function(f, idx) {
    var p = path.parse(f);
    p.full = path.resolve(f);
    p.idx = idx;
    var parts = path.resolve(p.dir).split(path.sep);
    var idx = p.name;
    if(parts.length > shortestPath) {
      idx = parts.slice(parts.length - (parts.length - shortestPath)).join('/') + '/' + p.name;
    }
    entry[idx] = f;
    p.buildPath = idx + p.ext;
    components.push(_.omit(p, ['root', 'ext']));
  });

}

module.exports = function(opts) {
  var mapped_styles = map_styles(opts.styles, opts.assets);

  var entry = {};
  var components = [];
  resolve_components(opts.scenarios, entry, components);

  var runner_preLoaders = [
    { test: /scenarios\/.+\.template\.js$/, loader: __dirname + "/lib/scenario-loader?type=template" },
    { test: /scenarios\/.+\.riot\.js$/, loader: __dirname + "/lib/scenario-loader?type=riot" },
    { test: /scenarios\/.+\.backbone\.js$/, loader: __dirname + "/lib/scenario-loader?type=backbone" },
    { test: /scenarios\/.+\.marionette\.js$/, loader: __dirname + "/lib/scenario-loader?type=marionette" }
  ];

  var viewer_loaders = [
    { test: require.resolve(__dirname + "/lib/viewer.js"), loader: buildImportString(components, mapped_styles) }
  ];

  var scenario_options = build_config(opts, entry, null, runner_preLoaders);
  var viewer_options = build_config(opts, {'viewer': __dirname + '/lib/viewer.js'}, viewer_loaders);

  var compiler = webpack(scenario_options, function(err, stats) {
    if (err || (stats.compilation.errors && stats.compilation.errors.length > 0)) {
      console.log(err, stats.compilation.errors);
    }
    reload(_.keys(stats.compilation.assets));
  });

  var viewer_compiler = webpack(viewer_options, function(err, stats) {
    if (err || (stats.compilation.errors && stats.compilation.errors.length > 0)) {
      console.log(err, stats.compilation.errors);
    }
  });

  if(opts.use_statilc_only){
    start_express(opts.watch, opts.styles, opts.assets, opts.port);
  } else {
    start_browserSync(opts.watch, opts.styles, opts.assets, opts.port);

  }
}
