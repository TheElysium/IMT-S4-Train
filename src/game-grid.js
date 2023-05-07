import {TurnRail} from "./models/turnRail.js";
import {RailCell} from "./components/rail-cell.js";
import {StraightRail} from "./models/straightRail.js";
import {Station} from "./models/station.js";
import {stationType as StationType} from "./models/stationType.js";
import {StationCell} from "./components/station-cell.js";
import {Train} from "./models/train.js";
import {visualizePath, getCellPosition, getCell} from "./utils/utils.js";
import {Rail} from "./models/rail.js";
import {SwitchRail} from "./models/switchRail.js";

export class GameGrid {
    constructor(width, height, container) {
        this.width = width;
        this.height = height;
        this.container = container;
        this.grid = new Array(height).fill(null).map(() => new Array(width).fill(null));
        this.startStation = new Station({x: 0, y: 0}, StationType.START);
        this.endStation = new Station({x: height-1, y: width-1}, StationType.END);
        this.train = null;
        this.path = [];
        this.playing = false;
        this.initGrid();
    }

    initGrid() {
        for (let x = 0; x < this.height; x++) {
            for (let y = 0; y < this.width; y++) {
                const cell = document.createElement("div");
                cell.classList.add("c-wrapper__grid-container__game-grid__cell");
                cell.innerHTML = '';
                cell.dataset.x = x;
                cell.dataset.y = y;
                this.container.appendChild(cell);
                if(x === this.startStation.position.x && y === this.startStation.position.y){
                    const stationCell = new StationCell(this.startStation);
                    this.train = new Train(this.getPathCoordinates([{from: null, rail: this.startStation, to: null}]));
                    this.train.addToDom(stationCell);
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

    addStraightRail(position){
        const cell = getCell(position.x, position.y, this.container);
        const {x, y} = position;

        // Click: Add straight rail
        let rail = new StraightRail(x, y);
        let railCell = new RailCell(rail);

        // Add rail to the DOM
        cell.innerHTML = '';
        cell.appendChild(railCell);

        this.addRailToGridArray(rail, {x, y});
        this.updatePath();
    }

    addTurnRail(position){
        const cell = getCell(position.x, position.y, this.container);
        const {x, y} = position;

        // Click: Add turn rail
        let rail = new TurnRail(x, y);
        let railCell = new RailCell(rail);

        // Add rail to the DOM
        cell.innerHTML = '';
        cell.appendChild(railCell);

        this.addRailToGridArray(rail, {x, y});
        this.updatePath();

    }

    addSwitchRail(position){
        const cell = getCell(position.x, position.y, this.container);
        const {x, y} = position;

        let rail = new SwitchRail(x, y);
        let railCell = new RailCell(rail);

        cell.innerHTML = '';
        cell.appendChild(railCell);

        this.addRailToGridArray(rail, {x, y});
        this.updatePath();
    }

    removeRail(position) {

        // Remove rail from the grid array
        this.removeRailFromGridArray(position.x, position.y);

        // Remove rail cell from DOM
        const cell = getCell(position.x, position.y, this.container);
        cell.innerHTML = '';

        this.updatePath();
    }

    rotateRail(position) {
        const railCell = getCell(position.x, position.y, this.container).firstChild;
        railCell.rotate();
        this.removeRailFromGridArray(railCell.rail.x, railCell.rail.y);
        this.addRailToGridArray(railCell.rail, {x: railCell.rail.x, y: railCell.rail.y}, this.grid);

        this.updatePath();
    }

    updatePath() {
        this.updateConnectionIndicators(this.path, "#595959");
        this.path = this.pathBetweenStations();
        this.train.path = this.getPathCoordinates(this.path);
        this.updateConnectionIndicators(this.path, "green");
    }


    // Add rail to the array representation of the grid
    addRailToGridArray(rail, position) {
        const {x, y} = position;
        this.grid[x][y] = rail;

        const neighbours = rail.getPossibleNeighbours(this.grid);
        neighbours.forEach((neighbour) => {
            if (neighbour) {
                if (rail.canConnect(neighbour, this.grid)) {
                    rail.addNeighbour(neighbour);
                    neighbour.addNeighbour(rail);
                }
            }
        });
        this.updatePath();
    }

    // Remove rail from the array representation of the grid
    removeRailFromGridArray(x, y) {
        const railToRemove = this.grid[x][y];
        this.grid[x][y] = null;

        railToRemove.neighbours.forEach((neighbour) => {
            neighbour.removeNeighbour(railToRemove);
        });
        railToRemove.neighbours = [];
    }

    // updateConnectionIndicators(position, color) {
    //     const cell = this.grid[position.x][position.y];
    //     if (cell instanceof Rail) {
    //         this.updateTrackColor(position, color);
    //     }
    //     else if (cell instanceof Station) {
    //         this.updateStationsColor(color);
    //     }
    //     visualizePath(this.train.path, this.container);
    // }

    updateConnectionIndicators(path, color) {
        path.forEach((pathElem) => {
            if(pathElem !== null) {
                const {x,y} = {x: pathElem.rail.x, y: pathElem.rail.y};
                this.updateTrackColor(pathElem.rail, color);
            }
        });
        visualizePath(this.train.path, this.container);
    }

    updateTrackColor(rail, color) {
        const position = {x: rail.x, y: rail.y};
        if(rail instanceof Station) {
            const cell = getCell(position.x, position.y, this.container, "station-cell");
            cell.updateTrackColor(color);
        }
        else if (rail instanceof Rail) {
            const cell = getCell(position.x, position.y, this.container, "rail-cell");
            cell.updateTrackColor(color);
        }
    }

    updateStationsColor(color) {
        const startStationCell = getCell(this.startStation.position.x, this.startStation.position.y, this.container, "station-cell");

        const endStationCell =  getCell(this.endStation.position.x, this.endStation.position.y, this.container, "station-cell");

        startStationCell.updateStationColor(color);
        endStationCell.updateStationColor(color);
    }


    play(timestamp) {
        if (!this.playing) {
            if (this.train.reachedEnd) {
                this.resetTrain();
            }
            this.startTrain(timestamp);
        }
    }

    pause(timestamp) {
        if (this.playing) {
            this.pauseTrain(timestamp);
        }
    }

    reset() {
        this.pauseTrain();
        this.resetTrain();
    }

    accelerate() {
        this.train.accelerate();
    }

    decelerate() {
        this.train.decelerate();
    }

    startTrain(timestamp) {
        this.path = this.pathBetweenStations();
        if (this.path[this.path.length - 1] === null) return;
        this.train.path = this.getPathCoordinates(this.path);
        this.train.start(timestamp);
        this.playing = true;
        this.moveTrain();
    }

    pauseTrain(timestamp) {
        this.train.pause(timestamp);
        this.playing = false;
    }

    resetTrain() {
        this.train.reset();
        this.train.render(this.train.currentCell, this.container);
    }

    pathBetweenStations() {
        return this.startStation.getPathTo(null, this.endStation);
    }

    getPathCoordinates(path) {
        const coordinates = [];
        path.filter((railOnPath) => railOnPath !== null).forEach((railOnPath) => {
            const {x, y} = railOnPath.rail;
            const cell = getCell(x, y, this.container)
            const cellWidth = cell.clientWidth;
            const cellHeight = cell.clientHeight;
            let trainCoordinates = {
                x: x * cellWidth + cellWidth / 2,
                y: y * cellHeight + cellHeight / 2,
                rotation: this.getRotation(railOnPath),
            }
            coordinates.push(trainCoordinates);
        });
        return coordinates;
    }

    getRotation(railOnPath) {
        if(railOnPath.from === null || railOnPath.to ===  null ) return 0;
        if(railOnPath.rail instanceof StraightRail || (railOnPath.rail instanceof SwitchRail && railOnPath.rail.getCurrentRail() instanceof StraightRail)) return 0;

        const fromPosition = {x: railOnPath.from.x, y: railOnPath.from.y};
        const railPosition = {x: railOnPath.rail.x, y: railOnPath.rail.y};
        const toPosition = {x: railOnPath.to.x, y: railOnPath.to.y};

        return this.calculateTurnAngle(fromPosition, railPosition, toPosition);
    }

    calculateTurnAngle(fromPosition, turnRail, toPosition) {
        const prevDiffX = turnRail.x - fromPosition.x;
        const prevDiffY = turnRail.y - fromPosition.y;
        const nextDiffX = toPosition.x - turnRail.x;
        const nextDiffY = toPosition.y - turnRail.y;

        if ((prevDiffX === 0 && nextDiffY === 0) || (prevDiffY === 0 && nextDiffX === 0)) {
            if (prevDiffX * nextDiffY - prevDiffY * nextDiffX > 0) {
                return -90;
            } else {
                return 90;
            }
        } else {
            throw new Error('Invalid turn configuration');
        }
    }


    moveTrain() {
        const move = (timestamp) => {
            if (!this.train.previousDeltaTime) {
                this.train.previousDeltaTime = timestamp;
            }

            if (this.train.timestamp.pause && this.train.timestamp.resume) {
                const pauseDuration = this.train.timestamp.resume - this.train.timestamp.pause;
                this.train.previousDeltaTime += pauseDuration;
                this.train.timestamp.pause = null;
                this.train.timestamp.resume = null;
            }

            const deltaTime = (timestamp - this.train.previousDeltaTime);

            const newPos = this.train.move(deltaTime);
            if (newPos) {
                this.train.render(newPos, this.container);
                this.train.previousDeltaTime = timestamp;
                this.train.animationFrame = requestAnimationFrame(move);
            } else {
                this.playing = false;
                this.train.reachedEnd = true;
            }
        };

        this.train.animationFrame = requestAnimationFrame(move);
    }

}