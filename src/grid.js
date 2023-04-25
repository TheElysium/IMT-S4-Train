import { TurnRail } from "./models/turnRail.js";
import { RailCell } from "./components/rail-cell.js";
import {
  StraightRailOrientation,
  TurnRailOrientation,
} from "./models/orientations.js";
import { StraightRail } from "./models/straightRail.js";
import { Station } from "./models/station.js";
import { stationType as StationType } from "./models/stationType.js";
import { StationCell } from "./components/station-cell.js";
import { gridHeight, gridWidth } from "./main.js";

export class Grid {
  constructor(width, height, container) {
    this.width = width;
    this.height = height;
    this.container = container;
    this.grid = new Array(height)
      .fill(null)
      .map(() => new Array(width).fill(null));
    this.startStation = new Station({ x: 0, y: 0 }, StationType.START);
    this.endStation = new Station(
      { x: height - 1, y: width - 1 },
      StationType.END
    );
    this.initGrid();
    this.addEventListeners();
  }

  initGrid() {
    for (let x = 0; x < this.height; x++) {
      for (let y = 0; y < this.width; y++) {
        const cell = document.createElement("div");
        cell.classList.add("c-wrapper__grid-container__grid__cell");
        cell.innerHTML = "";
        cell.dataset.x = x;
        cell.dataset.y = y;
        this.container.appendChild(cell);
        if (
          x === this.startStation.position.x &&
          y === this.startStation.position.y
        ) {
          const stationCell = new StationCell(this.startStation);
          cell.appendChild(stationCell);
          this.addRailToGridArray(this.startStation, { x, y });
        } else if (
          x === this.endStation.position.x &&
          y === this.endStation.position.y
        ) {
          const stationCell = new StationCell(this.endStation);
          cell.appendChild(stationCell);
          this.addRailToGridArray(this.endStation, { x, y });
        }
      }
    }
  }

  addEventListeners() {
    this.container.addEventListener("mousedown", (event) =>
      this.handleMouseDown(event)
    );
    this.container.addEventListener("railclick", (event) =>
      this.removeRail(event)
    );
    this.container.addEventListener("railrotate", (event) =>
      this.rotateRail(event)
    );
    this.container.addEventListener("wheel", (event) =>
      this.zoomHandler(event)
    );
  }

  removeRail(event) {
    const railCell = event.target;
    const cell = railCell.parentElement;
    const position = this.getCellPosition(cell);

    // Remove rail from the grid array
    this.removeRailFromGridArray(position.x, position.y);

    // Remove rail cell from DOM
    cell.removeChild(railCell);

    this.areStationsConnected()
      ? this.updateStationsColor("green")
      : this.updateStationsColor("#D9D9D9");
  }

  rotateRail(event) {
    const railCell = event.target;
    railCell.rotate();
    this.removeRailFromGridArray(railCell.rail.x, railCell.rail.y);
    this.addRailToGridArray(
      railCell.rail,
      { x: railCell.rail.x, y: railCell.rail.y },
      this.grid
    );
    this.areStationsConnected()
      ? this.updateStationsColor("green")
      : this.updateStationsColor("#D9D9D9");
  }

  addRail(event) {
    const cell = event.target;
    if (cell.classList.contains("c-wrapper__grid-container__grid__cell")) {
      const position = this.getCellPosition(cell);
      const { x, y } = position;

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
      cell.innerHTML = "";
      cell.appendChild(railCell);

      this.addRailToGridArray(rail, { x, y });

      this.areStationsConnected()
        ? this.updateStationsColor("green")
        : this.updateStationsColor("#D9D9D9");
    }
  }

  // Add rail to the array representation of the grid
  addRailToGridArray(rail, position) {
    const { x, y } = position;
    this.grid[x][y] = rail;
    this.updateTrackColor(position, "#595959");

    const neighbours = rail.getPossibleNeighbours(this.grid);
    neighbours.forEach((neighbour) => {
      if (neighbour) {
        const neighbourPosition = { x: neighbour.x, y: neighbour.y };
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
      if (neighbour.neighbours.length === 0) {
        this.updateTrackColor({ x: neighbour.x, y: neighbour.y }, "#595959");
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
    } else {
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

  areStationsConnected() {
    return this.startStation.isConnectedTo(this.startStation, this.endStation);
  }

  handleMouseDown(event) {
    if (event.ctrlKey) {
      const container = document.querySelector(".c-wrapper__grid-container");

      let pos = {
        // The current scroll
        left: container.scrollLeft,
        top: container.scrollTop,
        // Get the current mouse position
        x: event.clientX,
        y: event.clientY,
      };

      container.style.cursor = "grabbing";
      container.style.userSelect = "none";

      const mouseMoveHandler = (event) => {
        // How far the mouse has been moved
        const dx = event.clientX - pos.x;
        const dy = event.clientY - pos.y;

        const container = document.querySelector(".c-wrapper__grid-container");

        // Scroll the element
        container.scrollTop = pos.top - dy;
        container.scrollLeft = pos.left - dx;
      };

      const mouseUpHandler = (event) => {
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);

        container.style.removeProperty("cursor");
        container.style.removeProperty("user-select");
      };

      document.addEventListener("mouseup", mouseUpHandler);
      document.addEventListener("mousemove", mouseMoveHandler);
    } else {
      this.addRail(event);
    }
  }

  zoomHandler(event) {
    console.log("zoomHandler");

    // ONLY IF CTRL IS PRESSED
    if (event.ctrlKey) {
      // determine the direction of the scroll
      const direction = event.deltaY > 0 ? -1 : 1;

      // redifined the size of the grid template columns and rows
      // first get the current size
      const currentSize = parseInt(
          this.container.style.gridTemplateColumns
            .split(" ")[1]
            .replace("px)", "")
        ),
        // then calculate the new size
        newSize = currentSize + direction * 2;

      // if the new size is between 50 and 200, update the size
      if (newSize >= 30 && newSize <= 300) {
        this.container.style.gridTemplateColumns = `repeat(${gridWidth}, ${newSize}px)`;
        this.container.style.gridTemplateRows = `repeat(${gridHeight}, ${newSize}px)`;
      }

      // prevent the page from scrolling
      event.preventDefault();
    }
  }
}
