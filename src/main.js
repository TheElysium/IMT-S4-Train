import { Grid } from './grid.js';

const gridWidth = 10;
const gridHeight = 5;
const gridContainer = document.querySelector(".c-wrapper__grid-container__grid");
gridContainer.style.gridTemplateColumns = `repeat(${gridWidth}, 1fr)`;
gridContainer.style.gridTemplateRows = `repeat(${gridHeight}, 1fr)`;
const grid = new Grid(gridWidth, gridHeight, gridContainer);


// Default cell seclect
const defaultCell = grid.getCell(0, 0)
defaultCell.classList.add("active")
let activeCell = defaultCell;

addEventListener("keydown", (event) => keyDownDetected(event));

function keyDownDetected(e){

    switch (e.code) {
        case "ArrowRight":
            movingOnGrid(e.code)
            break;
        case "ArrowLeft":
            movingOnGrid(e.code)
            break;
        case "ArrowUp":
            movingOnGrid(e.code)
            break;
        case "ArrowDown":
            movingOnGrid(e.code)
            break;
        // Other key detection like rotation...
    }

}

function movingOnGrid(key){
    // TODO : verifier toujours sur la grille

    let xyCell = grid.getCellPosition(activeCell)
    let cell
    activeCell.classList.remove("active")
    
    switch (key) {
        case "ArrowRight":
            cell = grid.getCell(xyCell.x, xyCell.y+1)
            break;
        case "ArrowLeft":
            cell = grid.getCell(xyCell.x, xyCell.y-1)
            break;
        case "ArrowUp":
            cell = grid.getCell(xyCell.x-1, xyCell.y)
            break;
        case "ArrowDown":
            cell = grid.getCell(xyCell.x+1, xyCell.y)
            break;
    }

    if(cell == undefined){
        console.log('Trying to go out of grid')
        return;
    }

    activeCell = cell
    activeCell.classList.add("active")
    
}