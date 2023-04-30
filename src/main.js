import { GameGrid } from './game-grid.js';
import {InteractionGrid} from "./interaction-grid.js";

const gridWidth = 10;
const gridHeight = 5;
const gridContainer = document.querySelector(".c-wrapper__grid-container__game-grid");
gridContainer.style.gridTemplateColumns = `repeat(${gridWidth}, 1fr)`;
gridContainer.style.gridTemplateRows = `repeat(${gridHeight}, 1fr)`;
const grid = new GameGrid(gridWidth, gridHeight, gridContainer);

const proxyContainer = document.querySelector(".c-wrapper__grid-container__interaction-grid");
proxyContainer.style.gridTemplateColumns = `repeat(${gridWidth}, 1fr)`;
proxyContainer.style.gridTemplateRows = `repeat(${gridHeight}, 1fr)`;
const proxy = new InteractionGrid(gridWidth, gridHeight, proxyContainer, grid);