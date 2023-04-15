export class RailCell extends HTMLElement {
    constructor(rail) {
      super();
      this.rail = rail;
    }
  
    connectedCallback() {
      const svgMarkup = this.rail.getSvg();
  
      const svgContainer = document.createElement('div');
      svgContainer.innerHTML = svgMarkup;
  
      const svg = svgContainer.querySelector('svg');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  
      this.appendChild(svg);
    }
  }
  
  customElements.define('rail-cell', RailCell);  