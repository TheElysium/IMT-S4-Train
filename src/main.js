import { Grid } from './grid.js';

const gridWidth = 5;
const gridHeight = 3;
const gridContainer = document.querySelector(".c-wrapper__grid-container__grid");
gridContainer.style.gridTemplateColumns = `repeat(${gridWidth}, 1fr)`;
gridContainer.style.gridTemplateRows = `repeat(${gridHeight}, 1fr)`;
const grid = new Grid(gridWidth, gridHeight, gridContainer);