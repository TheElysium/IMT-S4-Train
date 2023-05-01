export class Train {
    constructor(path, speed = 0.001) {
        this.animationFrame = null;
        this.path = path;
        this.speed = speed;
        this.progress = 0;
        this.previousDeltaTime = null;
        this.currentCell = path[0];
        this.currentRotation = 0;
        this.timestamp = {resume: null, pause: null};
        this.reachedEnd = false;
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
        svg.style.zIndex = "2";
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

        const prevCoordinates = this.path[prevIndex];
        const nextCoordinates = this.path[nextIndex];

        if(!this.areCoordinatesEqual(prevCoordinates, this.currentCell)){
            console.log("Train has entered cell", prevCoordinates);
            this.currentCell = prevCoordinates;
            this.currentRotation += prevCoordinates.rotation;
        }

        // Linear interpolation
        const x = prevCoordinates.x * (1 - t) + nextCoordinates.x * t;
        const y = prevCoordinates.y * (1 - t) + nextCoordinates.y * t;

        const rotation = this.currentRotation;

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

    areCoordinatesEqual(a, b) {
        return a.x === b.x && a.y === b.y && a.rotation === b.rotation;
    }

    render(position, container) {
        if (!this.svgElement) {
            this.addToDom(container);
        }
        // Move the train to the new position
        this.svgElement.style.top = position.x + "px";
        this.svgElement.style.left = position.y + "px";
        this.svgElement.style.transform = `translate(-50%, -50%) rotate(${position.rotation}deg)`;
        // this.svgElement.style.transform = `translate(-50%, -50%)`;
    }

    start(timestamp) {
        this.timestamp.resume = timestamp;
        this.playing = true;
    }

    pause(timestamp) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
        this.timestamp.pause = timestamp;
    }

    reset() {
        cancelAnimationFrame(this.animationFrame);
        this.progress = 0;
        this.previousDeltaTime = null;
        this.currentCell = this.path[0];
        this.animationFrame = null;
        this.currentRotation = 0;
        this.reachedEnd = false;
        this.timestamp.resume = null;
        this.timestamp.pause = null;
        this.speed = 0.001;
    }

    decelerate() {
        if (this.speed > 0.00021){
            this.speed -= 0.0002;
        }
    }

    accelerate() {
        if (this.speed < 0.003){
            this.speed += 0.0002;
        }
    }
}