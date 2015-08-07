'use strict';

var riot = require('riot');

var anchor = document.getElementById('content');

var tagname = module.exports.tag;
anchor.innerHTML = '<' + module.exports.tag + '></' + module.exports.tag + '>';

riot.mount('*', module.exports.scenarios[window.scenario].context);