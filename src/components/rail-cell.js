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

    updateTrackColor(color) {
        const tracksRect = this.querySelectorAll(".track-rect");
        tracksRect.forEach((track) => {
            track.style.fill = color;
        });
        const tracksPath = this.querySelectorAll(".track-path");
        tracksPath.forEach((track) => {
            track.style.stroke = color;
        });
    }

    rotate() {
        const angle = this.rail.getRotationAngle();
        this.style.transform = `rotate(${angle}deg)`;
    }
}

customElements.define('rail-cell', RailCell);