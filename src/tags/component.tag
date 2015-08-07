<viewer-component>
  <div class={inner: true, selected: selected} onclick={ toggleScenarios }>{ module.name || name }</div>
  <div class={scenario: true, selected: parent.selected === name} if={ parent.showScenarios } each={ name, data in module.scenarios } onclick={ parent.onSelect }>{ name }</div>

  <script>
    import {radio} from '../utils';
    import _ from 'lodash';

    this.selected = false;
    this.showScenarios = false;

    this.toggleScenarios = () => {
      if (this.module.scenarios && _.keys(this.module.scenarios).length > 1) {
        this.showScenarios = !this.showScenarios;
      } else {
        this.selected = _.keys(this.module.scenarios)[0];
        radio.trigger('component.changed', this);
      }
    }

    this.onSelect = (event) => {
      event.preventDefault();
      event.cancelBubble = true;
      this.selected = event.item.name
      radio.trigger('component.changed', this);
    }

    radio.on('component.changed', (tag) => {
      if (tag !== this) {
        this.selected = false;
        this.update();
      }
    });
  </script>
</viewer-component>
