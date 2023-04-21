import {TurnRail} from "./models/turnRail.js";
import {RailCell} from "./components/rail-cell.js";
import {StraightRailOrientation, TurnRailOrientation} from "./models/orientations.js";
import {StraightRail} from "./models/straightRail.js";
import {Station} from "./models/station.js";
import {stationType as StationType} from "./models/stationType.js";
import {StationCell} from "./components/station-cell.js";

export class Grid {
    constructor(width, height, container) {
        this.width = width;
        this.height = height;
        this.container = container;
        this.grid = new Array(height).fill(null).map(() => new Array(width).fill(null));
        this.startStation = new Station({x: 0, y: 0}, StationType.START);
        this.endStation = new Station({x: height-1, y: width-1}, StationType.END);
        this.initGrid();
        this.addEventListeners();
        this.initMovement();
    }

    initGrid() {
        for (let x = 0; x < this.height; x++) {
            for (let y = 0; y < this.width; y++) {
                const cell = document.createElement("div");
                cell.classList.add("c-wrapper__grid-container__grid__cell");
                cell.innerHTML = '';
                cell.dataset.x = x;
                cell.dataset.y = y;
                this.container.appendChild(cell);
                if(x === this.startStation.position.x && y === this.startStation.position.y){
                    const stationCell = new StationCell(this.startStation);
                    cell.appendChild(stationCell);
                    this.addRailToGridArray(this.startStation, {x, y});
                }
                else if (x === this.endStation.position.x && y === this.endStation.position.y){
                    const stationCell = new StationCell(this.endStation);
                    cell.appendChild(stationCell);
                    this.addRailToGridArray(this.endStation, {x, y});
                }
            }
        }
    }

    addEventListeners() {
        this.container.addEventListener("mousedown", (event) => this.addRail(event));
        this.container.addEventListener("railclick", (event) => this.removeRail(event));
        this.container.addEventListener("railrotate", (event) => this.rotateRail(event));
        addEventListener("keydown", (event) => this.keyDownDetected(event));
        addEventListener("mousemove", (event) => this.movingOnGridWithMouse(event));
    }

    removeRail(event) {
        const railCell = event.target;
        const cell = railCell.parentElement;
        const position = this.getCellPosition(cell);

        // Remove rail from the grid array
        this.removeRailFromGridArray(position.x, position.y);

        // Remove rail cell from DOM
        cell.removeChild(railCell);

        this.areStationsConnected() ? this.updateStationsColor("green") : this.updateStationsColor("#D9D9D9");
    }

    rotateRail(event) {
        const railCell = event.target;
        railCell.rotate();
        this.removeRailFromGridArray(railCell.rail.x, railCell.rail.y);
        this.addRailToGridArray(railCell.rail, {x: railCell.rail.x, y: railCell.rail.y}, this.grid);
        this.areStationsConnected() ? this.updateStationsColor("green") : this.updateStationsColor("#D9D9D9");
    }

    addRail(event) {
        const cell = event.target;
        if (cell.classList.contains("c-wrapper__grid-container__grid__cell")) {
            const position = this.getCellPosition(cell);
            const {x, y} = position;

            // TODO : Remove the left click and right click logic, it is only for testing purposes
            let rail;
            let railCell;
            if (event.button === 0) {
                // Left click: Add turn rail
                rail = new TurnRail(x, y, TurnRailOrientation.BOTTOM_RIGHT);
            } else if (event.button === 2) {
                // Right click: Add straight rail
                rail = new StraightRail(x, y, StraightRailOrientation.VERTICAL);
            }
            railCell = new RailCell(rail);

            // Add rail to the DOM
            cell.innerHTML = '';
            cell.appendChild(railCell);

            this.addRailToGridArray(rail, {x, y});

            this.areStationsConnected() ? this.updateStationsColor("green") : this.updateStationsColor("#D9D9D9");
        }
    }

    // Add rail to the array representation of the grid
    addRailToGridArray(rail, position) {
        const {x, y} = position;
        this.grid[x][y] = rail;
        this.updateTrackColor(position, "#595959");

        const neighbours = rail.getPossibleNeighbours(this.grid);
        neighbours.forEach((neighbour) => {
            if (neighbour) {
                const neighbourPosition = {x: neighbour.x, y: neighbour.y};
                if (rail.canConnect(neighbour, this.grid)) {
                    rail.addNeighbour(neighbour);
                    neighbour.addNeighbour(rail);
                    this.updateTrackColor(position, "red");
                    this.updateTrackColor(neighbourPosition, "red");
                }
            }
        });
    }

    // Remove rail from the array representation of the grid
    removeRailFromGridArray(x, y) {
        const railToRemove = this.grid[x][y];
        this.grid[x][y] = null;

        railToRemove.neighbours.forEach((neighbour) => {
            neighbour.removeNeighbour(railToRemove);
            if(neighbour.neighbours.length === 0) {
                this.updateTrackColor({x: neighbour.x, y: neighbour.y}, '#595959');
            }
        });
        railToRemove.neighbours = [];
    }

    updateTrackColor(position, color) {
        const railCell = this.container.querySelector(
            `.c-wrapper__grid-container__grid__cell[data-x="${position.x}"][data-y="${position.y}"] rail-cell`
        );
        if (railCell) {
            railCell.updateTrackColor(color);
        }
        else {
            const stationCell = this.container.querySelector(
                `.c-wrapper__grid-container__grid__cell[data-x="${position.x}"][data-y="${position.y}"] station-cell`
            );
            stationCell.updateTrackColor(color);
        }
    }

    updateStationsColor(color) {
        const startStationCell = this.container.querySelector(
            `.c-wrapper__grid-container__grid__cell[data-x="${this.startStation.position.x}"][data-y="${this.startStation.position.y}"] station-cell`
        );
        const endStationCell = this.container.querySelector(
            `.c-wrapper__grid-container__grid__cell[data-x="${this.endStation.position.x}"][data-y="${this.endStation.position.y}"] station-cell`
        );
        startStationCell.updateStationColor(color);
        endStationCell.updateStationColor(color);
    }

    getCellPosition(cell) {
        return {
            x: parseInt(cell.dataset.x),
            y: parseInt(cell.dataset.y),
        };
    }

    getCell(x, y) {
        return this.container.querySelector(
            `.c-wrapper__grid-container__grid__cell[data-x="${x}"][data-y="${y}"]`
        );
    }

    areStationsConnected() {
        return this.startStation.isConnectedTo(this.startStation, this.endStation);
    }

    keyDownDetected(e){

        switch (e.code) {
            case "ArrowRight":
                this.movingOnGridWithKeyboard(e.code)
                break;
            case "ArrowLeft":
                this.movingOnGridWithKeyboard(e.code)
                break;
            case "ArrowUp":
                this.movingOnGridWithKeyboard(e.code)
                break;
            case "ArrowDown":
                this.movingOnGridWithKeyboard(e.code)
                break;
            // Other key detection like rotation...
        }
    
    }
    
    movingOnGridWithKeyboard(key){
    
        let xyCell = this.getCellPosition(this.activeCell);
        let cell;
        
        switch (key) {
            case "ArrowRight":
                cell = this.getCell(xyCell.x, xyCell.y+1);
                break;
            case "ArrowLeft":
                cell = this.getCell(xyCell.x, xyCell.y-1);
                break;
            case "ArrowUp":
                cell = this.getCell(xyCell.x-1, xyCell.y);
                break;
            case "ArrowDown":
                cell = this.getCell(xyCell.x+1, xyCell.y);
                break;
        }
    
        if(cell == undefined){
            console.log('Trying to go out of grid');
            return;
        }
        this.activeCell.classList.remove("active");
        this.activeCell = cell;
        this.activeCell.classList.add("active");
    }
    
    movingOnGridWithMouse(event){
        
        let cell = event.target;
       
        if(!Array.from(cell.classList).includes("c-wrapper__grid-container__grid__cell")){
            console.log("Not on the grid");
            return;
        }
    
        //console.log(this.activeCell)

        this.activeCell.classList.remove("active");
        this.activeCell = cell;
        this.activeCell.classList.add("active");
        
    }

    initMovement(){
        let defaultCell = this.getCell(0, 0);
        this.activeCell = defaultCell;
        this.activeCell.classList.add("active");
    }

}