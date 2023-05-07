import {Rail} from "./rail.js";
import {StraightRailOrientation, SwitchRailOrientation, TurnRailOrientation} from "./orientations.js";
import {StraightRail} from "./straightRail.js";
import {TurnRail} from "./turnRail.js";

export const SwitchType = {
    STRAIGHT: "straight",
    TURN_1: "turn-1",
    TURN_2: "turn-2",
}

export class SwitchRail extends Rail {
    constructor(x, y, orientation = SwitchRailOrientation.HORIZONTAL_TOP) {
        super(x, y, orientation);
        this.switchType =  SwitchType.STRAIGHT;
        this.straightRail = new StraightRail(x, y);
        this.turnRail1 = new TurnRail(x, y, TurnRailOrientation.TOP_LEFT);
        this.turnRail2 = new TurnRail(x, y, TurnRailOrientation.TOP_RIGHT);
    }

    getSvg() {
        return `
<svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="76.8462" y="201" width="14.9701" height="98" fill="#964415"/>
<rect x="131.737" y="201" width="14.9701" height="98" fill="#964415"/>
<rect x="21.9561" y="201" width="14.9701" height="98" fill="#964415"/>
<rect x="241.517" y="201" width="14.9701" height="98" fill="#964415"/>
<rect x="296.407" y="201" width="14.9701" height="98" fill="#964415"/>
<rect x="186.627" y="201" width="14.9701" height="98" fill="#964415"/>
<rect x="406.188" y="201" width="14.9701" height="98" fill="#964415"/>
<rect x="461.078" y="201" width="14.9701" height="98" fill="#964415"/>
<rect x="351.297" y="201" width="14.9701" height="98" fill="#964415"/>
<rect x="200.1" y="92.5" width="15" height="97.8044" transform="rotate(-90 200.1 92.5)" fill="#964415"/>
<rect x="200.1" y="37.5" width="15" height="97.8044" transform="rotate(-90 200.1 37.5)" fill="#964415"/>
<rect x="200.1" y="147.5" width="15" height="97.8044" transform="rotate(-90 200.1 147.5)" fill="#964415"/>
<rect x="107.784" y="209" width="15" height="107.784" transform="rotate(90 107.784 209)" fill="#595959"/>
<rect x="141.717" y="277" width="15" height="141.717" transform="rotate(90 141.717 277)" fill="#595959"/>
<rect x="291.417" y="143" width="14.9701" height="143" transform="rotate(180 291.417 143)" fill="#595959"/>
<rect x="223.553" y="108.761" width="14.9701" height="108.761" transform="rotate(180 223.553 108.761)" fill="#595959"/>
<path d="M216.068 107.5C216.068 137.646 211.869 173.908 192.116 193.5C172.786 212.672 137.226 216.5 107.784 216.5" stroke="#595959" stroke-width="15"/>
<path d="M141.717 284.5C179.302 284.5 214.35 269.039 240.927 242.409C267.504 215.779 283.932 180.661 283.932 143" stroke="#595959" stroke-width="15"/>
<rect width="15" height="107.784" transform="matrix(0 1 1 0 392.216 209)" fill="#595959"/>
<rect width="15" height="141.717" transform="matrix(0 1 1 0 358.283 277)" fill="#595959"/>
<rect width="14.9701" height="143" transform="matrix(1 0 0 -1 208.583 143)" fill="#595959"/>
<rect width="14.9701" height="108.761" transform="matrix(1 0 0 -1 276.447 108.761)" fill="#595959"/>
<path d="M283.932 107.5C283.932 137.646 288.131 173.908 307.884 193.5C327.214 212.672 362.774 216.5 392.216 216.5" stroke="#595959" stroke-width="15"/>
<path d="M358.283 284.5C320.698 284.5 285.65 269.039 259.073 242.409C232.496 215.779 216.068 180.661 216.068 143" stroke="#595959" stroke-width="15"/>
<rect x="499.002" y="209" width="15" height="499.002" transform="rotate(90 499.002 209)" fill="#595959"/>
<rect x="499.002" y="277" width="15" height="499.002" transform="rotate(90 499.002 277)" fill="#595959"/>
</svg>

            `
    }

    getPossibleNeighbours(grid) {
        let neighbours = [];

        switch (this.switchType) {
            case SwitchType.STRAIGHT:
                neighbours = this.straightRail.getPossibleNeighbours(grid);
                break;
            case SwitchType.TURN_1:
                neighbours = this.turnRail1.getPossibleNeighbours(grid);
                break;
            case SwitchType.TURN_2:
                neighbours = this.turnRail2.getPossibleNeighbours(grid);
                break;
            default:
                throw new Error("Unknown switch type");
        }

        return neighbours;
    }

    getRotationAngle() {
        switch (this.orientation) {
            case SwitchRailOrientation.HORIZONTAL_TOP:
                this.orientation = SwitchRailOrientation.VERTICAL_RIGHT;
                break;
            case SwitchRailOrientation.HORIZONTAL_BOTTOM:
                this.orientation = SwitchRailOrientation.VERTICAL_LEFT;
                break;
            case SwitchRailOrientation.VERTICAL_LEFT:
                this.orientation = SwitchRailOrientation.HORIZONTAL_TOP;
                break;
            case SwitchRailOrientation.VERTICAL_RIGHT:
                this.orientation = SwitchRailOrientation.HORIZONTAL_BOTTOM;
        }
        this.straightRail.getRotationAngle();
        this.turnRail1.getRotationAngle();
        this.turnRail2.getRotationAngle();

        return this.orientation.angle;
    }

    getCurrentRail() {
        if(this.switchType === SwitchType.STRAIGHT) {
            return this.straightRail;
        }
        else if (this.switchType === SwitchType.TURN_1) {
            return this.turnRail1;
        }
        else if (this.switchType === SwitchType.TURN_2) {
            return this.turnRail2;
        }
        else {
            throw new Error("Unknown switch type");
        }
    }

    // canConnect(neighbourRail, grid) {
    //     let currRail = this.getCurrentRail();
    //     return neighbourRail.getPossibleNeighbours(grid).includes(currRail);
    // }

    // getPathTo(previous, goal, current = this) {
    //     const currRail = this.getCurrentRail();
    //     super.getPathTo(previous, goal, currRail);
    // }


}