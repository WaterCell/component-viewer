'use strict';

var renderBackbone = function renderBackbone(View, context) {
  var override = {
    el: document.getElementById('content'),
    attachElContent: function attachElContent(html) {
      this.el.innerHTML = html;
      return this;
    }
  };

  var Cls = View.extend(override);
  var instance = new Cls(context);

  return instance.render();
};

renderBackbone(module.exports.view, module.exports.scenarios[window.scenario].context);