import {GameGrid} from "./game-grid.js";
import {InteractionGrid} from "./interaction-grid.js";
import {ControlPanel} from "./components/control-panel.js";

export const gridWidth = 35;
export const gridHeight = 35;
const gameGridContainer = document.querySelector(
    ".c-wrapper__grid-container__game-grid"
);
gameGridContainer.style.gridTemplateColumns = `repeat(${gridWidth}, 150px)`;
gameGridContainer.style.gridTemplateRows = `repeat(${gridHeight}, 150px)`;
const gameGrid = new GameGrid(gridWidth, gridHeight, gameGridContainer);

const interactionContainer = document.querySelector(
    ".c-wrapper__grid-container__interaction-grid"
);
interactionContainer.style.gridTemplateColumns = `repeat(${gridWidth}, 150px)`;
interactionContainer.style.gridTemplateRows = `repeat(${gridHeight}, 150px)`;
const interactionGrid = new InteractionGrid(
    gridWidth,
    gridHeight,
    interactionContainer,
    gameGrid
);

const uiContainer = document.querySelector(".c-wrapper__ui-container");
const controlPanel = new ControlPanel(interactionGrid);
uiContainer.appendChild(controlPanel);