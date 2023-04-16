import { Grid } from './grid.js';

const gridWidth = 4;
const gridHeight = 4;
const gridContainer = document.querySelector(".c-wrapper__grid-container__grid");
const grid = new Grid(gridWidth, gridHeight, gridContainer);