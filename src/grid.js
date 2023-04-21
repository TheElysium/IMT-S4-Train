import {TurnRail} from "./models/turnRail.js";
import {RailCell} from "./components/rail-cell.js";
import {StraightRailOrientation, TurnRailOrientation} from "./models/orientations.js";
import {StraightRail} from "./models/straightRail.js";
import {Station} from "./models/station.js";
import {stationType as StationType} from "./models/stationType.js";
import {StationCell} from "./components/station-cell.js";
import {Train} from "./models/train.js";

export class Grid {
    constructor(width, height, container) {
        this.width = width;
        this.height = height;
        this.container = container;
        this.grid = new Array(height).fill(null).map(() => new Array(width).fill(null));
        this.startStation = new Station({x: 0, y: 0}, StationType.START);
        this.endStation = new Station({x: height-1, y: width-1}, StationType.END);
        this.train = null;
        this.initGrid();
        this.addEventListeners();

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
                    this.train = new Train(this.getPathCoordinates([this.startStation]));
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

    addEventListeners() {
        this.container.addEventListener("mousedown", (event) => this.addRail(event));
        this.container.addEventListener("railclick", (event) => this.removeRail(event));
        this.container.addEventListener("railrotate", (event) => this.rotateRail(event));
        this.container.addEventListener("stationclick", () => this.startTrain());
    }

    removeRail(event) {
        const railCell = event.target;
        const cell = railCell.parentElement;
        const position = this.getCellPosition(cell);

        // Remove rail from the grid array
        this.removeRailFromGridArray(position.x, position.y);

        // Remove rail cell from DOM
        cell.removeChild(railCell);

        const pathBetweenStations = this.pathBetweenStations();
        pathBetweenStations[pathBetweenStations.length - 1] === this.endStation ? this.updateStationsColor("green") : this.updateStationsColor("#D9D9D9");
    }

    rotateRail(event) {
        const railCell = event.target;
        railCell.rotate();
        this.removeRailFromGridArray(railCell.rail.x, railCell.rail.y);
        this.addRailToGridArray(railCell.rail, {x: railCell.rail.x, y: railCell.rail.y}, this.grid);

        const pathBetweenStations = this.pathBetweenStations();
        pathBetweenStations[pathBetweenStations.length - 1] === this.endStation ? this.updateStationsColor("green") : this.updateStationsColor("#D9D9D9");
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
                rail = new TurnRail(x, y);
            } else if (event.button === 2) {
                // Right click: Add straight rail
                rail = new StraightRail(x, y);
            }
            railCell = new RailCell(rail);

            // Add rail to the DOM
            cell.innerHTML = '';
            cell.appendChild(railCell);

            this.addRailToGridArray(rail, {x, y});

            const pathBetweenStations = this.pathBetweenStations();
                pathBetweenStations[pathBetweenStations.length - 1] === this.endStation ? this.updateStationsColor("green") : this.updateStationsColor("#D9D9D9");
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

    startTrain() {
        const pathBetweenStations = this.pathBetweenStations();
        if (pathBetweenStations[pathBetweenStations.length-1] !== this.endStation){
            console.log("Stations not connected !")
            return;
        }
        this.train.path = this.getPathCoordinates(pathBetweenStations);
        this.moveTrain();
    }

    pathBetweenStations() {
        const path = this.startStation.getPathTo(this.startStation, this.endStation);
        this.visualizePath(this.getPathCoordinates(path));
        return path;
    }

    getPathCoordinates(path) {
        const coordinates = [];
        path.filter((rail) => rail !== null).forEach((rail) => {
            const cell = this.getCell(rail.x, rail.y);
            const cellWidth = cell.clientWidth;
            const cellHeight = cell.clientHeight;
            let trainPosition = {
                x: rail.x * cellHeight + cellHeight / 2,
                y: rail.y * cellWidth + cellWidth / 2
            }
            coordinates.push(trainPosition);
        });
        this.visualizePath(coordinates);
        return coordinates;
    }

    visualizePath(coordinates) {
        // Remove existing path and points
        const existingPath = this.container.querySelectorAll(".path");
        const existingPoints = this.container.querySelectorAll(".point");
        existingPath.forEach((path) => path.remove());
        existingPoints.forEach((point) => point.remove());
        console.log("visualize path");
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.classList.add("path");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.style.position = "absolute";

        // Prevent pointer events
        svg.style.pointerEvents = "none";

        this.container.appendChild(svg);

        coordinates.forEach((coordinate, index) => {
            console.log("create point");
            const point = document.createElement('div');
            point.classList.add('point');
            point.style.left = coordinate.y + 'px';
            point.style.top = coordinate.x + 'px';
            point.style.position = 'absolute';
            point.style.width = '10px';
            point.style.height = '10px';
            point.style.backgroundColor = 'blue';
            this.container.appendChild(point);

            if (index > 0) {
                const previousCoordinate = coordinates[index - 1];
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", previousCoordinate.y);
                line.setAttribute("y1", previousCoordinate.x);
                line.setAttribute("x2", coordinate.y);
                line.setAttribute("y2", coordinate.x);
                line.setAttribute("stroke", "black");
                line.setAttribute("stroke-width", "2");


                svg.appendChild(line);
            }
        });
    }

    moveTrain() {
        const move = (timestamp) => {
            if (!this.train.previousDeltaTime) {
                this.train.previousDeltaTime = timestamp;
            }
            const deltaTime = (timestamp - this.train.previousDeltaTime);
            const newPos = this.train.move(deltaTime);

            if (newPos) {
                this.train.render(newPos, this.container);
                this.train.previousDeltaTime = timestamp;
                requestAnimationFrame(move);
            }
        };

        requestAnimationFrame(move);
    }
}