export class Train {
    constructor(path, speed = 0.001) {
        this.animationFrame = null;
        this.path = path;
        this.speed = speed;
        this.progress = 0;
        this.previousDeltaTime = null;
        this.currentCell = path[0];
        this.currentRotation = 0;
    }

    getSvg() {
        return `
        <svg width="100%" height="100%" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M74 185H362C397.899 185 427 214.101 427 250V250C427 285.899 397.899 315 362 315H74V185Z" fill="#8D7AFF"/>
        </svg>
        `;
    }

    createSvg() {
        const svgContainer = document.createElement('div');
        svgContainer.innerHTML = this.getSvg();

        const svg = svgContainer.querySelector('svg');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.position = "absolute";
        svg.style.top = 0 + "px";
        svg.style.left = 0 + "px";
        svg.style.zIndex = "100";
        return svg;
    }

    move(deltaTime) {
        this.progress += this.speed * deltaTime;

        if (this.progress >= this.path.length - 1) {
            this.progress = this.path.length;
            return null; // Train has reached the end station
        }

        const prevIndex = Math.floor(this.progress);
        const nextIndex = Math.ceil(this.progress);

        const t = this.progress - prevIndex;

        const prevPosition = this.path[prevIndex];
        const nextPosition = this.path[nextIndex];

        if(prevPosition !== this.currentCell){
            console.log("Train has entered cell", prevPosition);
            this.currentCell = prevPosition;
        }

        // Linear interpolation
        const x = prevPosition.x * (1 - t) + nextPosition.x * t;
        const y = prevPosition.y * (1 - t) + nextPosition.y * t;
        const rotation = 0;

        return { x, y, rotation };
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
        // Move the train to the new position
        this.svgElement.style.top = position.x + "px";
        this.svgElement.style.left = position.y + "px";

        // this.svgElement.style.transform = `translate(-50%, -50%) rotate(${position.rotation}deg)`;
        this.svgElement.style.transform = `translate(-50%, -50%)`;
    }
}