import {StraightRailOrientation} from './orientations.js';
import {Rail} from './rail.js';

export class StraightRail extends Rail {
    constructor(x, y, orientation = StraightRailOrientation.HORIZONTAL) {
        super(x, y, orientation);
    }

    getSvg() {
        return `
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="423" y="299" width="15" height="98" transform="rotate(-180 423 299)" fill="#964415"/>
            <rect x="368" y="299" width="15" height="98" transform="rotate(-180 368 299)" fill="#964415"/>
            <rect x="478" y="299" width="15" height="98" transform="rotate(-180 478 299)" fill="#964415"/>
            <rect x="258" y="299" width="15" height="98" transform="rotate(-180 258 299)" fill="#964415"/>
            <rect x="203" y="299" width="15" height="98" transform="rotate(-180 203 299)" fill="#964415"/>
            <rect x="313" y="299" width="15" height="98" transform="rotate(-180 313 299)" fill="#964415"/>
            <rect x="93" y="299" width="15" height="98" transform="rotate(-180 93 299)" fill="#964415"/>
            <rect x="38" y="299" width="15" height="98" transform="rotate(-180 38 299)" fill="#964415"/>
            <rect x="148" y="299" width="15" height="98" transform="rotate(-180 148 299)" fill="#964415"/>
            <rect class="track-rect" y="291" width="15" height="500" transform="rotate(-90 0 291)" fill="#595959"/>
            <rect class="track-rect" y="223" width="15" height="500" transform="rotate(-90 0 223)" fill="#595959"/>
        </svg>
      `;
    }

    getPossibleNeighbours(grid) {
        const neighbours = [];

        if (this.orientation === StraightRailOrientation.VERTICAL) {
            neighbours.push(grid[this.x - 1]?.[this.y]);
            neighbours.push(grid[this.x + 1]?.[this.y]);
        } else {
            neighbours.push(grid[this.x]?.[this.y - 1]);
            neighbours.push(grid[this.x]?.[this.y + 1]);
        }
        return neighbours;
    };

    getRotationAngle() {
        if (this.orientation === StraightRailOrientation.VERTICAL) {
            this.orientation = StraightRailOrientation.HORIZONTAL;
        } else {
            this.orientation = StraightRailOrientation.VERTICAL;
        }
        return this.orientation.angle;
    }
}
  