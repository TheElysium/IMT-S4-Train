import {getCell, getCellPosition} from "./utils/utils.js";

export class InteractionGrid {
    constructor(width, height, container, gameGrid) {
        this.width = width;
        this.height = height;
        this.container = container;
        this.gameGrid = gameGrid;

        this.initGrid();
        this.addEventListeners();
        this.initMovement();
    }

    initGrid() {
        for (let x = 0; x < this.height; x++) {
            for (let y = 0; y < this.width; y++) {
                const cell = document.createElement("div");
                cell.classList.add("c-wrapper__grid-container__interaction-grid__cell");
                cell.dataset.x = x;
                cell.dataset.y = y;

                const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute("width", "100%");
                svg.setAttribute("height", "100%");
                svg.setAttribute("viewBox", "0 0 100 100");
                svg.setAttribute("fill", "none");

                cell.appendChild(svg);
                this.container.appendChild(cell);
                cell.addEventListener("mouseenter", (event) => this.movingOnGridWithMouse(event));
            }
        }
    }

    addEventListeners() {
        this.container.addEventListener("click", (event) => {
            const cell = event.target;
            const x = cell.dataset.x;
            const y = cell.dataset.y;
        });
        addEventListener("keydown", (event) => this.keyDownDetected(event));
    }

    keyDownDetected(e){
        if (e.code === "ArrowRight" || e.code === "ArrowLeft" || e.code === "ArrowUp" || e.code === "ArrowDown") {
            this.movingOnGridWithKeyboard(e.code)
        }
        else {
            console.log("Keypress not supported yet.");
        }
    }

    movingOnGridWithKeyboard(key){
        const xyCell = getCellPosition(this.activeCell);
        let cell;

        switch (key) {
            case "ArrowRight":
                cell = getCell(xyCell.x, xyCell.y+1, this.container);
                break;
            case "ArrowLeft":
                cell = getCell(xyCell.x, xyCell.y-1, this.container);
                break;
            case "ArrowUp":
                cell = getCell(xyCell.x-1, xyCell.y, this.container);
                break;
            case "ArrowDown":
                cell = getCell(xyCell.x+1, xyCell.y, this.container);
                break;
        }
        cell ? this.updateActiveCell(cell) : console.log('Trying to go out of grid');
    }

    movingOnGridWithMouse(event){
        let cell = event.target;
        if(!Array.from(cell.classList).includes("c-wrapper__grid-container__interaction-grid__cell")){
            console.log("Not on the grid");
            return;
        }

        this.updateActiveCell(cell);
    }

    updateActiveCell(cell) {
        this.activeCell.classList.remove("active");
        this.activeCell = cell;
        this.activeCell.classList.add("active");
    }

    initMovement(){
        this.activeCell = getCell(0, 0, this.container);
        this.activeCell.classList.add("active");
    }
}