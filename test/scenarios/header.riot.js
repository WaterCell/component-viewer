require('../../src/tags/header');
require('../../src/viewer.styl');

module.exports = {
  tag: 'viewer-header',
  view: '../../src/tags/header',
  scenarios: {
    'default': {
      context: {some: 'thing'},
      description: 'default scenario'
    },
    'scenario 2': {
      context: {some: 'thing'},
      description: 'another scenario'
    }
  }
};
