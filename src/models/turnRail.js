import {Rail} from './rail.js';
import {TurnRailOrientation} from "./orientations.js";

export class TurnRail extends Rail {
    constructor(x, y, orientation = TurnRailOrientation.BOTTOM_RIGHT) {
        super(x, y, orientation);
    }

    getSvg() {
        return `
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="200.5" y="422.5" width="15" height="98" transform="rotate(-90 200.5 422.5)" fill="#964415"/>
            <rect x="201.929" y="359.869" width="15" height="98" transform="rotate(-81.1459 201.929 359.869)" fill="#964415"/>
            <rect x="218" y="289.257" width="15" height="98" transform="rotate(-62.1073 218 289.257)" fill="#964415"/>
            <rect x="281.304" y="221.543" width="15" height="98" transform="rotate(-21.8847 281.304 221.543)" fill="#964415"/>
            <rect x="200.5" y="477.5" width="15" height="98" transform="rotate(-90 200.5 477.5)" fill="#964415"/>
            <rect x="422" y="299" width="15" height="98" transform="rotate(-180 422 299)" fill="#964415"/>
            <rect x="373.186" y="297.644" width="15" height="98" transform="rotate(172.675 373.186 297.644)" fill="#964415"/>
            <rect x="477" y="299" width="15" height="98" transform="rotate(-180 477 299)" fill="#964415"/>
            <rect  class="track-rect" x="392" y="291" width="15" height="108" transform="rotate(-90 392 291)" fill="#595959"/>
            <rect  class="track-rect" x="358" y="223" width="15" height="142" transform="rotate(-90 358 223)" fill="#595959"/>
            <rect  class="track-rect" x="208" y="357" width="15" height="143" fill="#595959"/>
            <rect  class="track-rect" x="276" y="391.239" width="15" height="108.761" fill="#595959"/>
            <path  class="track-path" d="M283.5 392.5C283.5 362.354 287.708 326.092 307.5 306.5C326.868 287.328 362.5 283.5 392 283.5" stroke="#595959" stroke-width="15"/>
            <path  class="track-path" d="M358 215.5C320.339 215.5 285.221 230.961 258.591 257.591C231.961 284.221 215.5 319.339 215.5 357" stroke="#595959" stroke-width="15"/>
        </svg>
      `;
    }

    getPossibleNeighbours(grid) {
        const neighbours = [];

        switch (this.orientation) {
            case TurnRailOrientation.TOP_LEFT:
                neighbours.push(grid[this.x]?.[this.y - 1]);
                neighbours.push(grid[this.x - 1]?.[this.y]);
                break;
            case TurnRailOrientation.TOP_RIGHT:
                neighbours.push(grid[this.x]?.[this.y + 1]);
                neighbours.push(grid[this.x - 1]?.[this.y]);
                break;
            case TurnRailOrientation.BOTTOM_LEFT:
                neighbours.push(grid[this.x]?.[this.y - 1]);
                neighbours.push(grid[this.x + 1]?.[this.y]);
                break;
            case TurnRailOrientation.BOTTOM_RIGHT:
                neighbours.push(grid[this.x]?.[this.y + 1]);
                neighbours.push(grid[this.x + 1]?.[this.y]);
                break;
        }
        return neighbours;
    }

    getRotationAngle() {
        switch (this.orientation) {
            case TurnRailOrientation.TOP_LEFT:
                this.orientation = TurnRailOrientation.TOP_RIGHT;
                break;
            case TurnRailOrientation.TOP_RIGHT:
                this.orientation = TurnRailOrientation.BOTTOM_RIGHT;
                break;
            case TurnRailOrientation.BOTTOM_LEFT:
                this.orientation = TurnRailOrientation.TOP_LEFT;
                break;
            case TurnRailOrientation.BOTTOM_RIGHT:
                this.orientation = TurnRailOrientation.BOTTOM_LEFT;
                break;
            default:
                throw new Error('Invalid orientation');
        }
        return this.orientation.angle;
    }
}
  