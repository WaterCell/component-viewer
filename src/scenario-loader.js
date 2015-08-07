var fs = require('fs');
var querystring = require('querystring');

module.exports = function(source) {
  var query = querystring.parse(this.query.substr(1));

  this.cacheable && this.cacheable();
  if (query.type) {
    if (query.type === 'marionette') {
      return source + fs.readFileSync(__dirname + '/loaders/marionette.js');
    } else if(query.type === 'backbone') {
      return source + fs.readFileSync(__dirname + '/loaders/backbone.js');
    } else if(query.type === 'riot') {
      return source + fs.readFileSync(__dirname + '/loaders/riot.js');
    }
  }
  return source + fs.readFileSync(__dirname + '/loaders/template.js');
};
