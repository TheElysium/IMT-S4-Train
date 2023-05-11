import {getCell, getCellPosition} from "./utils/utils.js";
import {StraightRail} from "./models/straightRail.js";
import {TurnRail} from "./models/turnRail.js";
import {SwitchRail} from "./models/switchRail.js";
import {gridHeight, gridWidth} from "./main.js";

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
                cell.addEventListener("mouseenter", (event) =>
                    this.movingOnGridWithMouse(event)
                );
            }
        }
    }

    addEventListeners() {
        addEventListener("keydown", (event) => this.handleKeydown(event));
        this.container.addEventListener("mousedown", (event) =>
            this.handleClick(event)
        );
        this.container.addEventListener("wheel", (event) => this.handleWheel(event));
    }

    handleWheel(event) {
        if (event.ctrlKey) {
            this.zoomInOut(event);
        }
        else {
            const position = getCellPosition(this.activeCell);
            this.gameGrid.rotateRail(position);
        }
    }

    handleClick(event) {
        if (event.ctrlKey) {
            this.dragMap(event);
            return;
        }

        if (event.button !== 0) {
            return;
        }

        const position = getCellPosition(this.activeCell);
        const gameGridCell = this.gameGrid.grid[position.x][position.y];
        if (gameGridCell === null) {
            this.menuRail(position, event.pageX, event.pageY);
        }
        else if(gameGridCell instanceof StraightRail || gameGridCell instanceof TurnRail){
            this.menuRail2(position, event.pageX, event.pageY);
            //this.gameGrid.removeRail(position);
        }
        else if(gameGridCell instanceof SwitchRail){
            console.log("Switching rail");
            gameGridCell.switch();
            this.gameGrid.removeRailFromGridArray(position.x, position.y);
            this.gameGrid.addRailToGridArray(gameGridCell, position);
        }
    }

    handleKeydown(e) {
        if (
            e.code === "ArrowRight" ||
            e.code === "ArrowLeft" ||
            e.code === "ArrowUp" ||
            e.code === "ArrowDown"
        ) {
            this.movingOnGridWithKeyboard(e.code);
        } else {
            console.log("Keypress not supported yet.");
        }
    }

    movingOnGridWithKeyboard(key) {
        const xyCell = getCellPosition(this.activeCell);
        let cell;

        switch (key) {
            case "ArrowRight":
                cell = getCell(xyCell.x, xyCell.y + 1, this.container);
                break;
            case "ArrowLeft":
                cell = getCell(xyCell.x, xyCell.y - 1, this.container);
                break;
            case "ArrowUp":
                cell = getCell(xyCell.x - 1, xyCell.y, this.container);
                break;
            case "ArrowDown":
                cell = getCell(xyCell.x + 1, xyCell.y, this.container);
                break;
        }
        cell
            ? this.updateActiveCell(cell)
            : console.log("Trying to go out of grid");
    }

    movingOnGridWithMouse(event) {
        let cell = event.target;
        if (
            !Array.from(cell.classList).includes(
                "c-wrapper__grid-container__interaction-grid__cell"
            )
        ) {
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

    initMovement() {
        this.activeCell = getCell(0, 0, this.container);
        this.activeCell.classList.add("active");
    }

    menuRail(position, width, height) {
        const menu = document.getElementById('circle-triple');

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
        };
    }


    menuRail2(position, width, height) {
        const menu2 = document.getElementById('circle-double');

        this.showMenu(menu2, width, height);

        const rotateRail = document.getElementById('rotate-rail');
        const removeRail = document.getElementById('remove-rail');

        rotateRail.onmouseup = () => {
            this.gameGrid.rotateRail(position);
            this.hideMenu(menu2);
        };

        removeRail.onmouseup = () => {
            this.gameGrid.removeRail(position);
            this.hideMenu(menu2);
        };

        menu2.onmouseup = () => {
            this.hideMenu(menu2);
        };

        menu2.onmouseleave = () => {
            this.hideMenu(menu2);
        }
    }

    showMenu(menu, x, y) {
        menu.style.display = "flex";
        const width = menu.offsetWidth;
        const height = menu.offsetHeight;

        menu.style.left = x - width / 2 + "px";
        menu.style.top = y - height / 2 + "px";
    }

    hideMenu(menu) {
        menu.style.display = "none";
    }

    zoomInOut(event) {
        // determine the direction of the scroll
        const direction = event.deltaY > 0 ? -1 : 1;

        // redifined the size of the grid template columns and rows
        // first get the current size
        const currentSize = parseInt(
                this.container.style.gridTemplateColumns
                    .split(" ")[1]
                    .replace("px)", "")
            ),
            // then calculate the new size
            newSize = currentSize + direction * 2;
        const gameGridContainer = this.gameGrid.container;

        // if the new size is between 50 and 200, update the size
        if (newSize >= 50 && newSize <= 300 && newSize * gridWidth >= this.container.offsetWidth && newSize * gridHeight >= this.container.offsetHeight) {
            this.container.style.gridTemplateColumns = `repeat(${gridWidth}, ${newSize}px)`;
            this.container.style.gridTemplateRows = `repeat(${gridHeight}, ${newSize}px)`;

            gameGridContainer.style.gridTemplateColumns = `repeat(${gridWidth}, ${newSize}px)`;
            gameGridContainer.style.gridTemplateRows = `repeat(${gridHeight}, ${newSize}px)`;
        }

        // prevent the page from scrolling
        event.preventDefault();
    }

    dragMap(event) {
        const container = document.querySelector(".c-wrapper__grid-container");

        let pos = {
            // The current scroll
            left: container.scrollLeft,
            top: container.scrollTop,
            // Get the current mouse position
            x: event.clientX,
            y: event.clientY,
        };

        container.style.cursor = "grabbing";
        container.style.userSelect = "none";

        const mouseMoveHandler = (event) => {
            // How far the mouse has been moved
            const dx = event.clientX - pos.x;
            const dy = event.clientY - pos.y;

            // Scroll the element
            container.scrollTop = pos.top - dy;
            container.scrollLeft = pos.left - dx;
        };

        const mouseUpHandler = () => {
            document.removeEventListener("mousemove", mouseMoveHandler);
            document.removeEventListener("mouseup", mouseUpHandler);

            container.style.removeProperty("cursor");
            container.style.removeProperty("user-select");
        };

        document.addEventListener("mouseup", mouseUpHandler);
        document.addEventListener("mousemove", mouseMoveHandler);
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