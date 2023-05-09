import {Rail} from "./rail.js";
import {StraightRailOrientation} from "./orientations.js";

export class Station extends Rail {
    constructor(position, type) {
        super(position.x, position.y, StraightRailOrientation.HORIZONTAL);
        this.position = position;
        this.type = type;
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
            <rect class="station-rect" x="83" y="74" width="335" height="111" fill="#D9D9D9"/>
            <path d="M124.5 9L250 9V74H63L124.5 9Z" fill="#CC5E1F"/>
            <path d="M374.5 9L249 9V74H436L374.5 9Z" fill="#CC5E1F"/>
        </svg>
        `
    }

    getPossibleNeighbours(grid) {
        const neighbours = [];
        if (this.type === "start") {
            neighbours.push(grid[this.x]?.[this.y + 1]);
        } else {
            neighbours.push(grid[this.x]?.[this.y - 1]);
        }
        return neighbours;
    }
}