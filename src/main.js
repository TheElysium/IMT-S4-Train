import { StraightRail } from "./models/straightRail.js";
import { RailCell } from "./components/rail-cell.js";
import { StraightRailOrientation } from "./models/orientations.js";

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
gridContainer.addEventListener("click", (event) => {
    const cell = event.target;
  
    if (cell.classList.contains("c-wrapper__grid-container__grid__cell")) {
      const x = parseInt(cell.dataset.x);
      const y = parseInt(cell.dataset.y);
  
      cell.innerHTML = '';
      const straightRail = new StraightRail(x, y, StraightRailOrientation.VERTICAL);
      addRail(straightRail, { x, y }, grid);
      const straightRailCell = new RailCell(straightRail);
      
      cell.appendChild(straightRailCell);
    }
});

// Add rail to the array representation of the grid 
function addRail(rail, position, grid) {
  const { x, y } = position;
  grid[x][y] = rail;

  const neighbours = rail.getPossibleNeighbours(grid);
  neighbours.forEach((neighbour) => {
    if(neighbour) {
      const neighbourPosition = { x: neighbour.x, y: neighbour.y };
      console.log(neighbourPosition);
      if (rail.canConnect(neighbour)) {
          rail.addNeighbour(neighbour);
          neighbour.addNeighbour(rail);
      }
    }    
  });
}
  