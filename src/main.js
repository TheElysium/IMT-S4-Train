import {StraightRail} from "./models/straightRail.js";
import {RailCell} from "./components/rail-cell.js";
import {StraightRailOrientation, TurnRailOrientation} from "./models/orientations.js";
import {TurnRail} from "./models/turnRail.js";

const gridWidth = 4;
const gridHeight = 4;

// Create an empty grid (2D array)
const grid = new Array(gridHeight).fill(null).map(() => new Array(gridWidth).fill(null));

const gridContainer = document.querySelector(".c-wrapper__grid-container__grid");

// Create the grid
for (let x = 0; x < gridHeight; x++) {
    for (let y = 0; y < gridWidth; y++) {
        const cell = document.createElement("div");
        cell.classList.add("c-wrapper__grid-container__grid__cell");
        cell.dataset.x = x;
        cell.dataset.y = y;
        gridContainer.appendChild(cell);
    }
}

// Add rail to grid
gridContainer.addEventListener("mousedown", (event) => {
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
            addRail(turnRail, {x, y}, grid);
        } else if (event.button === 2) {
            // Right click: Add straight rail
            const straightRail = new StraightRail(x, y, StraightRailOrientation.VERTICAL);
            const straightRailCell = new RailCell(straightRail);
            cell.appendChild(straightRailCell);
            addRail(straightRail, {x, y}, grid);
        }
    }
});

// TODO : Perhaps temporary, only for testing purposes
gridContainer.addEventListener("railclick", (event) => {
    const railCell = event.target;
    const cell = railCell.parentElement;
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);

    // Remove rail from the grid array
    removeRail(x, y);

    // Remove rail cell from DOM
    cell.removeChild(railCell);
});

// Add rail to the array representation of the grid 
function addRail(rail, position, grid) {
    const {x, y} = position;
    grid[x][y] = rail;
    updateTrackColor(position, "#595959");

    const neighbours = rail.getPossibleNeighbours(grid);
    neighbours.forEach((neighbour) => {
        if (neighbour) {
            const neighbourPosition = {x: neighbour.x, y: neighbour.y};
            if (rail.canConnect(neighbour, grid)) {
                rail.addNeighbour(neighbour);
                neighbour.addNeighbour(rail);
                updateTrackColor(position, "red");
                updateTrackColor(neighbourPosition, "red");
            }
        }
    });
}

function removeRail(x, y) {
    const railToRemove = grid[x][y];
    grid[x][y] = null;

    railToRemove.neighbours.forEach((neighbour) => {
        neighbour.removeNeighbour(railToRemove);
        if(neighbour.neighbours.length === 0) {
            updateTrackColor({x: neighbour.x, y: neighbour.y}, '#595959');
        }
    });
}

function updateTrackColor(position, color) {
    const railCell = gridContainer.querySelector(
        `.c-wrapper__grid-container__grid__cell[data-x="${position.x}"][data-y="${position.y}"] rail-cell`
    );
    if (railCell) {
        railCell.updateTrackColor(color);
    }
}

gridContainer.addEventListener("railrotate", rotateRail);

function rotateRail(event){
    const railCell = event.target;
    railCell.rotate();
    removeRail(railCell.rail.x, railCell.rail.y);
    addRail(railCell.rail, {x: railCell.rail.x, y: railCell.rail.y}, grid);
}