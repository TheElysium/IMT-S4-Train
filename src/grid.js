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
        this.container.addEventListener("mousedown", (event) => this.addRail(event));
        this.container.addEventListener("railclick", (event) => this.removeRail(event));
        this.container.addEventListener("railrotate", (event) => this.rotateRail(event));
    }

    removeRail(event) {
        const railCell = event.target;
        const cell = railCell.parentElement;
        const position = this.getCellPosition(cell);

        // Remove rail from the grid array
        this.removeRailFromGridArray(position.x, position.y);

        // Remove rail cell from DOM
        cell.removeChild(railCell);
    }

    rotateRail(event) {
        const railCell = event.target;
        railCell.rotate();
        this.removeRailFromGridArray(railCell.rail.x, railCell.rail.y);
        this.addRailToGridArray(railCell.rail, {x: railCell.rail.x, y: railCell.rail.y}, this.grid);
    }

    addRail(event) {
        const cell = event.target;
        if (cell.classList.contains("c-wrapper__grid-container__grid__cell")) {
            const position = this.getCellPosition(cell);
            const {x, y} = position;

            // TODO : Remove the left click and right click logic, it is only for testing purposes
            let rail;
            let railCell;
            if (event.button === 0) {
                // Left click: Add turn rail
                rail = new TurnRail(x, y, TurnRailOrientation.BOTTOM_RIGHT);
                railCell = new RailCell(rail);
            } else if (event.button === 2) {
                // Right click: Add straight rail
                rail = new StraightRail(x, y, StraightRailOrientation.VERTICAL);
                railCell = new RailCell(rail);
            }
            cell.innerHTML = '';
            cell.appendChild(railCell);
            this.addRailToGridArray(rail, {x, y});
        }
    }

    // Add rail to the array representation of the grid
    addRailToGridArray(rail, position) {
        const {x, y} = position;
        this.grid[x][y] = rail;
        this.updateTrackColor(position, "#595959");

        const neighbours = rail.getPossibleNeighbours(this.grid);
        neighbours.forEach((neighbour) => {
            if (neighbour) {
                const neighbourPosition = {x: neighbour.x, y: neighbour.y};
                if (rail.canConnect(neighbour, this.grid)) {
                    rail.addNeighbour(neighbour);
                    neighbour.addNeighbour(rail);
                    this.updateTrackColor(position, "red");
                    this.updateTrackColor(neighbourPosition, "red");
                }
            }
        });
    }

    removeRailFromGridArray(x, y) {
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

    getCellPosition(cell) {
        return {
            x: parseInt(cell.dataset.x),
            y: parseInt(cell.dataset.y),
        };
    }
}