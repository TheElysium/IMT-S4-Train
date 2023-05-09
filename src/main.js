import {GameGrid} from "./game-grid.js";
import {InteractionGrid} from "./interaction-grid.js";
import {ControlPanel} from "./components/control-panel.js";
import {TREES} from "./models/trees.js";

export const gridWidth = 10;
export const gridHeight = 10;
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
document.addEventListener('DOMContentLoaded', () => {
    const helpIcon = document.querySelector('.c-wrapper__ui-container__help__icon');
    const helpContent = document.querySelector('.c-wrapper__ui-container__help__content');

    helpIcon.addEventListener('click', () => {
        helpContent.classList.toggle('visible');
    });
});


const numTrees = gridHeight * gridWidth * 0.1;
const container = document.querySelector(".c-wrapper__grid-container__trees-container");

// Get the container's dimensions
const containerWidth = interactionContainer.offsetWidth;
const containerHeight = interactionContainer.offsetHeight;

for (let i = 0; i < numTrees; i++) {
    // Create a new tree by choosing a random tree from the TREES object
    const randomTreeIndex = Math.floor(Math.random() * Object.keys(TREES).length);
    const randomTreeSvgString = TREES[randomTreeIndex];
    const treeElement = new DOMParser().parseFromString(randomTreeSvgString, 'application/xml').documentElement;
    treeElement.classList.add("c-wrapper__grid-container__trees-container__tree");

    // Generate random positions for the tree based on the container's dimensions
    const xPos = Math.random() * containerWidth;
    const yPos = Math.random() * containerHeight;

    // Position the tree and make it visible
    treeElement.style.position = "absolute";
    treeElement.style.left = xPos + "px";
    treeElement.style.top = yPos + "px";

    // Add the tree to the container
    container.appendChild(treeElement);
}
