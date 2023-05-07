import {getCell, getCellPosition, visualizePath} from "./utils/utils.js";
import {StraightRail} from "./models/straightRail.js";
import {TurnRail} from "./models/turnRail.js";
import {Station} from "./models/station.js";

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

                this.container.appendChild(cell);
                cell.addEventListener("mouseenter", (event) => this.movingOnGridWithMouse(event));
            }
        }
    }

    addEventListeners() {
        addEventListener("keydown", (event) => this.keyDownDetected(event));
        this.container.addEventListener("mousedown", (event) => this.handleClick(event));
        this.container.addEventListener("wheel", () => {
            const position = getCellPosition(this.activeCell);
            this.gameGrid.rotateRail(position);
        });
    }

    handleClick(event) {
        if(event.button !== 0) {
            return;
        }
        const position = getCellPosition(this.activeCell);
        const gameGridCell = this.gameGrid.grid[position.x][position.y];
        if(gameGridCell === null){
            this.menuRail(position, event.pageX, event.pageY);
        }
        else if(gameGridCell instanceof StraightRail || gameGridCell instanceof TurnRail){
            this.gameGrid.removeRail(position);
        }
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

    menuRail(position, width, height) {
        const menu = document.getElementById('circle');

        this.showMenu(menu, width, height);

        const addStraightRail = document.getElementById('add-straight-rail');
        const addSwitchRail = document.getElementById('add-switch-rail');
        const addTurnRail = document.getElementById('add-turn-rail');

        addStraightRail.onmouseup = () => {
            this.gameGrid.addStraightRail(position);
            this.hideMenu(menu);
        };

        addTurnRail.onmouseup = () => {
            this.gameGrid.addTurnRail(position);
            this.hideMenu(menu);
        };

        addSwitchRail.onmouseup = () => {
            this.gameGrid.addSwitchRail(position);
            this.hideMenu(menu);
        }

        menu.onmouseup = () => {
            this.hideMenu(menu);
        };

        menu.onmouseleave = () => {
            this.hideMenu(menu);
        }
    }
    showMenu(menu, x, y) {
        menu.style.display = 'flex';
        const width = menu.offsetWidth;
        const height = menu.offsetHeight;

        menu.style.left = x - (width/2) + 'px';
        menu.style.top = y - (height/2) + 'px';
    }

    hideMenu(menu) {
        menu.style.display = 'none';
    }

    play(timestamp) {
        this.gameGrid.play(timestamp);
    }

    pause(timestamp) {
        this.gameGrid.pause(timestamp);
    }

    reset() {
        this.gameGrid.reset();
    }

    accelerate() {
        this.gameGrid.accelerate();
    }

    decelerate() {
        this.gameGrid.decelerate();
    }

    hideGrid() {
        this.container.style.display = "none";
    }

    showGrid() {
        this.container.style.display = "grid";
    }

    isPlaying() {
        return this.gameGrid.playing;
    }

}