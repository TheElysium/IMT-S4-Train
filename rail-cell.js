class RailCell extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const standardRailSvg = `
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="201" y="423" width="15" height="98" transform="rotate(-90 201 423)" fill="#964415"/>
        <rect x="201" y="368" width="15" height="98" transform="rotate(-90 201 368)" fill="#964415"/>
        <rect x="201" y="478" width="15" height="98" transform="rotate(-90 201 478)" fill="#964415"/>
        <rect x="201" y="258" width="15" height="98" transform="rotate(-90 201 258)" fill="#964415"/>
        <rect x="201" y="203" width="15" height="98" transform="rotate(-90 201 203)" fill="#964415"/>
        <rect x="201" y="313" width="15" height="98" transform="rotate(-90 201 313)" fill="#964415"/>
        <rect x="201" y="93" width="15" height="98" transform="rotate(-90 201 93)" fill="#964415"/>
        <rect x="201" y="38" width="15" height="98" transform="rotate(-90 201 38)" fill="#964415"/>
        <rect x="201" y="148" width="15" height="98" transform="rotate(-90 201 148)" fill="#964415"/>
        <rect x="209" width="15" height="500" fill="#595959"/>
        <rect x="277" width="15" height="500" fill="#595959"/>
        </svg>        
        `;

        const svgContainer = document.createElement('div');
        svgContainer.innerHTML = standardRailSvg;

        const svg = svgContainer.querySelector('svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        this.appendChild(svg);
    }
}

customElements.define('rail-cell', RailCell);
