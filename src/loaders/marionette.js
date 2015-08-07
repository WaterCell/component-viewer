var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var Marionette = require('backbone.marionette');

var renderMarionette = function(View, context) {
  var instance = new View(context);

  App = new Marionette.Application();

  var RootView = Marionette.LayoutView.extend({
    el: 'body',
    regions: {
      content: '#content'
    }
  });

  App.rootView = new RootView();

  $(function() {
    App.start();
    App.rootView.content.show(instance);
  });
}

renderMarionette(module.exports.view,
                 module.exports.scenarios[window.scenario].context);
