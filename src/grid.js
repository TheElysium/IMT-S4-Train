import {TurnRail} from "./models/turnRail.js";
import {RailCell} from "./components/rail-cell.js";
import {StraightRailOrientation, TurnRailOrientation} from "./models/orientations.js";
import {StraightRail} from "./models/straightRail.js";

export class Grid {
    constructor(width, height, container) {
        this.width = width;
        this.height = height;
        this.container = container;
        this.grid = new Array(height).fill(null).map(() => new Array(width).fill(null));

        this.initGrid();
        this.addEventListeners();
    }

    initGrid() {
        for (let x = 0; x < this.height; x++) {
            for (let y = 0; y < this.width; y++) {
                const cell = document.createElement("div");
                cell.classList.add("c-wrapper__grid-container__grid__cell");
                cell.dataset.x = x;
                cell.dataset.y = y;
                this.container.appendChild(cell);
            }
        }
    }

    addEventListeners() {
        this.container.addEventListener("mousedown", (event) => this.handleMouseDown(event));
        this.container.addEventListener("railclick", (event) => this.handleRailClick(event));
        this.container.addEventListener("railrotate", (event) => this.handleRailRotate(event));
    }

    handleMouseDown(event) {
        const cell = event.target;
        if (cell.classList.contains("c-wrapper__grid-container__grid__cell")) {
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);

            cell.innerHTML = '';

            // TODO : Remove the left click and right click logic, it is only for testing purposes
            if (event.button === 0) {
                // Left click: Add turn rail
                const turnRail = new TurnRail(x, y, TurnRailOrientation.BOTTOM_RIGHT);
                const turnRailCell = new RailCell(turnRail);
                cell.appendChild(turnRailCell);
                this.addRail(turnRail, {x, y}, this.grid);
            } else if (event.button === 2) {
                // Right click: Add straight rail
                const straightRail = new StraightRail(x, y, StraightRailOrientation.VERTICAL);
                const straightRailCell = new RailCell(straightRail);
                cell.appendChild(straightRailCell);
                this.addRail(straightRail, {x, y}, this.grid);
            }
        }
    }

    handleRailClick(event) {
        const railCell = event.target;
        const cell = railCell.parentElement;
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);

        // Remove rail from the grid array
        this.removeRail(x, y);

        // Remove rail cell from DOM
        cell.removeChild(railCell);
    }

    handleRailRotate(event) {
        const railCell = event.target;
        railCell.rotate();
        this.removeRail(railCell.rail.x, railCell.rail.y);
        this.addRail(railCell.rail, {x: railCell.rail.x, y: railCell.rail.y}, this.grid);
    }

    // Add rail to the array representation of the grid
    addRail(rail, position, grid) {
        const {x, y} = position;
        grid[x][y] = rail;
        this.updateTrackColor(position, "#595959");

        const neighbours = rail.getPossibleNeighbours(grid);
        neighbours.forEach((neighbour) => {
            if (neighbour) {
                const neighbourPosition = {x: neighbour.x, y: neighbour.y};
                if (rail.canConnect(neighbour, grid)) {
                    rail.addNeighbour(neighbour);
                    neighbour.addNeighbour(rail);
                    this.updateTrackColor(position, "red");
                    this.updateTrackColor(neighbourPosition, "red");
                }
            }
        });
    }

    removeRail(x, y) {
        const railToRemove = this.grid[x][y];
        this.grid[x][y] = null;

        railToRemove.neighbours.forEach((neighbour) => {
            neighbour.removeNeighbour(railToRemove);
            if(neighbour.neighbours.length === 0) {
                this.updateTrackColor({x: neighbour.x, y: neighbour.y}, '#595959');
            }
        });
    }

    updateTrackColor(position, color) {
        const railCell = this.container.querySelector(
            `.c-wrapper__grid-container__grid__cell[data-x="${position.x}"][data-y="${position.y}"] rail-cell`
        );
        if (railCell) {
            railCell.updateTrackColor(color);
        }
    }
}