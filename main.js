const gridWidth = 4;
const gridHeight = 4;

// Create an empty grid (2D array)
const grid = new Array(gridHeight).fill(null).map(() => new Array(gridWidth).fill(null));

const gridContainer = document.querySelector(".c-wrapper__grid-container__grid");

// Create the grid
for (let y = 0; y < gridHeight; y++) {
  for (let x = 0; x < gridWidth; x++) {
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
  
      const railCell = document.createElement("rail-cell");
      cell.appendChild(railCell);
    }
  });
  