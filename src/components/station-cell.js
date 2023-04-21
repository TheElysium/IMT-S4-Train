export class StationCell extends HTMLElement {
    constructor(station) {
        super();
        this.station = station;

        this.addEventListener("mousedown", (event) => {
            event.stopPropagation(); // Stop event propagation

            // Dispatch a custom event with the click event details
            const railClickEvent = new CustomEvent("stationclick", {
                bubbles: true,
                detail: {
                    originalEvent: event,
                },
            });

            this.dispatchEvent(railClickEvent);
        });
    }

    connectedCallback() {
        const svgMarkup = this.station.getSvg();

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
    }

    updateStationColor(color) {
        const stationRect = this.querySelector(".station-rect");
        stationRect.style.fill = color;
    }
}

customElements.define('station-cell', StationCell);