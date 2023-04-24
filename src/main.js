import { Grid } from "./grid.js";

const gridWidth = 11;
const gridHeight = 7;
const gridContainer = document.querySelector(
  ".c-wrapper__grid-container__grid"
);
gridContainer.style.gridTemplateColumns = `repeat(${gridWidth}, 150px)`;
gridContainer.style.gridTemplateRows = `repeat(${gridHeight}, 150px)`;
const grid = new Grid(gridWidth, gridHeight, gridContainer);
