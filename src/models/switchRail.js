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
            <path class="wood-straight-turn1" d="M76.8463 201H91.8163V299H76.8463V201Z" fill="#964415"/>
            <path class="wood-straight-turn1" d="M131.737 201H146.707V299H131.737V201Z" fill="#964415"/>
            <path class="wood-straight-turn1" d="M21.9561 201H36.9261V299H21.9561V201Z" fill="#964415"/>
            <path class="wood-straight" d="M241.517 201H256.487V299H241.517V201Z" fill="#964415"/>
            <path class="wood-straight" d="M296.407 201H311.377V299H296.407V201Z" fill="#964415"/>
            <path class="wood-straight" d="M186.627 201H201.597V299H186.627V201Z" fill="#964415"/>
            <path class="wood-straight-turn2" d="M406.188 201H421.158V299H406.188V201Z" fill="#964415"/>
            <path class="wood-straight-turn2" d="M461.078 201H476.048V299H461.078V201Z" fill="#964415"/>
            <path class="wood-straight-turn2" d="M351.297 201H366.267V299H351.297V201Z" fill="#964415"/>
            <path class="wood-turn1-turn2" d="M200.1 92.5V77.5H297.904V92.5H200.1Z" fill="#964415"/>
            <path class="wood-turn1-turn2" d="M200.1 37.5V22.5H297.904V37.5H200.1Z" fill="#964415"/>
            <path class="wood-turn1-turn2" d="M200.1 147.5V132.5H297.904V147.5H200.1Z" fill="#964415"/>
            <path class="path-turn1" d="M1.52588e-05 216.5H107.784C137.226 216.5 172.786 212.672 192.116 193.5C211.869 173.908 216.068 138.907 216.068 108.761V0M283.932 7.62939e-06L283.932 143C283.932 180.661 267.504 215.779 240.927 242.409C214.35 269.039 179.302 284.5 141.717 284.5H0" stroke="#595959" stroke-width="15"/>
            <path class="path-straight" d="M499.002 209V224H0V209L499.002 209Z" fill="#595959"/>
            <path class="path-straight" d="M499.002 277V292H0V277H499.002Z" fill="#595959"/>
            <path class="path-turn2" d="M216.068 7.62939e-06V143C216.068 180.661 232.496 215.779 259.073 242.409C285.65 269.039 320.698 284.5 358.283 284.5H500M283.932 0V108.761C283.932 138.907 288.132 173.908 307.884 193.5C327.214 212.672 362.774 216.5 392.216 216.5H500" stroke="#595959" stroke-width="15"/>
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

    switch() {
        switch (this.switchType) {
            case SwitchType.STRAIGHT:
                this.switchType = SwitchType.TURN_1;
                break;
            case SwitchType.TURN_1:
                this.switchType = SwitchType.TURN_2;
                break;
            case SwitchType.TURN_2:
                this.switchType = SwitchType.STRAIGHT;
                break;
            default:
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