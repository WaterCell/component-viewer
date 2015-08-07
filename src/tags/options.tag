<viewer-options>
  Resolution: <select id="resolution" onchange={ presetSelected }>
    <option id="custom" selected></option>
    <optgroup label="-------">
      <option value="preferred">preferred</option>
    </optgroup>
    <optgroup label="-------">
      <option>1280x720</option>
      <option>786x500</option>
      <option>200x400</option>
    </optgroup>
  </select>

  <script>
    import {radio} from '../utils';

    this.setOption = (width, height) => {
      this.custom.textContent = `${width}x${height}`;
    }

    this.presetSelected = () => {
      radio.trigger('resolution.preset', this.resolution.value);
    }

    radio.on('resolution.update', (width, height) => {
      var selected = this.resolution.querySelectorAll('option');
      if (selected[this.resolution.selectedIndex] !== this.custom) {
        this.resolution.value = this.custom.textContent;
      }
      this.setOption(width, height);
    });
  </script>
</viewer-options>
