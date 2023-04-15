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