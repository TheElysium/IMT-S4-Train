export class RailCell extends HTMLElement {
    constructor(rail) {
        super();
        this.rail = rail;

        // TODO : Perhaps temporary, this is for testing purposes
        this.addEventListener("mousedown", (event) => {
            event.stopPropagation(); // Stop event propagation

            // Dispatch a custom event with the click event details
            const railClickEvent = new CustomEvent("railclick", {
                bubbles: true,
                detail: {
                    originalEvent: event,
                },
            });

            this.dispatchEvent(railClickEvent);
        });

        this.addEventListener("wheel", (event) => {
            event.stopPropagation(); // Stop event propagation

            // Dispatch a custom event with the click event details
            const railClickEvent = new CustomEvent("railrotate", {
                bubbles: true,
                detail: {
                    originalEvent: event,
                },
            });

            this.dispatchEvent(railClickEvent);
        });
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

    updateTrackColor() {
        const tracks = this.querySelectorAll(".track");
        tracks.forEach((track) => {
            track.style.fill = "red";
            track.style.stroke = "red";
        });
    }

    rotate() {
        this.style.transform = `rotate(${this.rail.getRotationAngle()}deg)`;
    }
}

customElements.define('rail-cell', RailCell);