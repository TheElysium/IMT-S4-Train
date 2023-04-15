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
            addRail(turnRail, {x, y}, grid);
            const turnRailCell = new RailCell(turnRail);
            cell.appendChild(turnRailCell);
        } else if (event.button === 2) {
            // Right click: Add straight rail
            const straightRail = new StraightRail(x, y, StraightRailOrientation.VERTICAL);
            addRail(straightRail, {x, y}, grid);
            const straightRailCell = new RailCell(straightRail);
            cell.appendChild(straightRailCell);
        }
    }
});

// Add rail to the array representation of the grid 
function addRail(rail, position, grid) {
    const {x, y} = position;
    grid[x][y] = rail;

    const neighbours = rail.getPossibleNeighbours(grid);
    neighbours.forEach((neighbour) => {
        if (neighbour) {
            const neighbourPosition = {x: neighbour.x, y: neighbour.y};
            if (rail.canConnect(neighbour, grid)) {
                rail.addNeighbour(neighbour);
                neighbour.addNeighbour(rail);
            }
        }
    });
}
  