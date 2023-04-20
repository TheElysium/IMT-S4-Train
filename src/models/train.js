export class Train {
    constructor(path, speed = 0.1) {
        this.path = path;
        this.speed = speed;
        this.progress = 0;
        this.previousDeltaTime = null;
        this.currentPosition = {x: path[0].x, y: path[0].y};
    }

    getSvg() {
        return `
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect class="train-rect" width="100" height="100" fill="#D9D9D9"/>
        </svg>
        `;
    }

    createSvg() {
        const svgContainer = document.createElement('div');
        svgContainer.innerHTML = this.getSvg();

        const svg = svgContainer.querySelector('svg');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        console.log(this.currentPosition)
        svg.style.position = "absolute";
        svg.style.top = this.currentPosition.x + "px";
        svg.style.left = this.currentPosition.y + "px";
        svg.style.transform = "translate(-50%, -50%)";
        svg.style.zIndex = "100";
        return svg;
    }

    move(deltaTime) {
        this.progress += this.speed * deltaTime;

        if (this.progress >= this.path.length) {
            this.progress = this.path.length;
            return null; // Train has reached the end station
        }

        const prevIndex = Math.floor(this.progress);
        const nextIndex = Math.ceil(this.progress);
        const t = this.progress - prevIndex;

        const prevPosition = this.path[prevIndex];
        const nextPosition = this.path[nextIndex];

        // Linear interpolation
        const x = prevPosition.x * (1 - t) + nextPosition.x * t;
        const y = prevPosition.y * (1 - t) + nextPosition.y * t;

        return { x, y };
    }

    addToDom(container) {
        this.svgElement = this.createSvg();
        container.appendChild(this.svgElement);
    }

    removeFromDom() {
        if (this.svgElement) {
            this.svgElement.remove();
        }
    }

    render(position, container) {
        if (!this.svgElement) {
            this.addToDom(container);
        }
        this.svgElement.style.transform = `translate(${position.x}px, ${position.y}px)`;
        this.svgElement.style.transform = "translate(-50%, -50%)";

    }
}