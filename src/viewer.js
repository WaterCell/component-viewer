import 'babel/polyfill';
import './viewer.styl';
import riot from 'riot';
import './tags.js';

for(let component of components) {
  component.module = modules[component.idx];
}

riot.mount('viewer-main', { components: components, styles: styles });
