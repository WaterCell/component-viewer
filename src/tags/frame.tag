<viewer-frame>
  <div class="container">
    <iframe id="frame"></iframe>
  </div>
  <script>
    import {radio} from '../utils';
    import containerTemplate from '../container.jade';

    window.frameReloaded = () => {
      if (this.currentComponent) {
        this.frame.contentWindow.go(containerTemplate({
          componentSource: `${this.currentComponent.buildPath}`,
          scenario: this.currentScenario,
          styles: this.opts.styles
        }));
      }
    }

    this.currentComponent = null;
    this.currentScenario = 'default';

    this.loadFrame = () => {
      this.frame.setAttribute('src', `//${ window.location.host }/frame.html`);
    }

    this.setSize = (width = 300, height = 200) => {
      this.frame.style.width = `${width}px`;
      this.frame.style.height = `${height}px`;
    }

    this.startResize = (event) => {
      event.preventDefault();
      this.x = event.pageX;
      this.y = event.pageY;
      const rect = this.frame.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;

      document.addEventListener('mousemove', this.enactResize);
    };

    this.enactResize = (event) => {
      event.preventDefault();
      const width = Math.max(this.width + (event.pageX - this.x), 0),
      height = Math.max(this.height + (event.pageY - this.y), 0);
      this.setSize(width, height);
      radio.trigger('resolution.update', width, height);
    };

    this.endResize = (event) => {
      event.preventDefault();
      document.removeEventListener('mousemove', this.enactResize);
    };

    this.startTimeout = (event) => {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => this.endResize(event), 700);
    }

    this.cancelTimeout = (event) => {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
    }

    this.root.addEventListener('mousedown', this.startResize);
    this.root.addEventListener('mouseup', this.endResize);
    this.root.addEventListener('mousein', this.cancelTimeout);
    this.root.addEventListener('mouseout', this.startTimeout);

    this.on('mount', () => {
      const rect = this.frame.getBoundingClientRect();
      radio.trigger('resolution.update', rect.width, rect.height);
    });

    radio.on('component.changed', (tag) => {
      this.currentComponent = tag;
      radio.trigger('scenario.changed', tag.selected || 'default');
    });
    radio.on('scenario.changed', (scenario) => {
      this.currentScenario = scenario;
      this.loadFrame();
    });
    radio.on('resolution.preset', (resolution) => {
      let dim = { width: 100, height: 100 };

      if (resolution !== 'preferred') {
        [dim.width, dim.height] = resolution.split('x');
      } else {
        let scenarios = this.currentComponent && this.currentComponent.module.scenarios;
        let current = scenarios && scenarios[this.currentScenario];
        let moduleDimensions = this.currentComponent && this.currentComponent.module.dimensions;

        if (current && current.dimensions) {
          dim = current.dimensions;
        } else if (moduleDimensions) {
          dim = this.currentComponent.module.dimensions;
        }
      }
      this.setSize(dim.width, dim.height);
    });

    window.onload = () => {

      if (! location.search){ return; }

      let query_params = location.search.substr(1).split('&');
      let params = {};
      for (let i in query_params){
        let param = query_params[i].split('=');
        params[param[0]] = decodeURIComponent(param[1]);
      }


      // select scenario from query parameter

      let scenarios = [];

      let inners = document.querySelectorAll('viewer-component > div.inner');
      for(let inner of inners) {
        if (inner.textContent == params['inner']){
          inner.onclick();
          scenarios = inner.parentNode.querySelectorAll('.scenario');
        }
      }

      for(let scenario of scenarios) {
        if (scenario.textContent == params['scenario']){
          scenario.onclick();
        }
      }

    }
  </script>
</viewer-frame>
