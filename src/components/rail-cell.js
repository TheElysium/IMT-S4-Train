import {StraightRail} from "../models/straightRail.js";
import {TurnRail} from "../models/turnRail.js";
import {SwitchRail, SwitchType} from "../models/switchRail.js";

export class RailCell extends HTMLElement {
    constructor(rail) {
        super();
        this.rail = rail;
    }


    connectedCallback() {
        const svgMarkup = this.rail.getSvg();

        const svgContainer = document.createElement('div');
        svgContainer.innerHTML = svgMarkup;

        const svg = svgContainer.querySelector('svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        this.appendChild(svg);
    }

    updateTrackColor(color) {
        if(this.rail instanceof StraightRail || this.rail instanceof TurnRail){
            const tracksRect = this.querySelectorAll(".track-rect");
            tracksRect.forEach((track) => {
                track.style.fill = color;
            });
            const trackPath = this.querySelectorAll(".track-path");
            trackPath.forEach((track) => {
                track.style.stroke = color;
            });
        }
        else {
            const setColor = (selector, color) => {
                const elements = this.querySelectorAll(selector);
                elements.forEach((element) => {
                    if (element.classList.contains("path-straight")) {
                        element.style.fill = color;
                    }
                    else {
                        element.style.stroke = color;
                    }
                });
            };

            const activeSelectors = {
                [SwitchType.STRAIGHT]: [
                    ".path-straight",
                ],
                [SwitchType.TURN_1]: [
                    ".path-turn1",
                ],
                [SwitchType.TURN_2]: [
                    ".path-turn2",
                ],
            };

            const activeSwitchSelector = activeSelectors[this.rail.switchType];

            if (activeSwitchSelector) {
                setColor(activeSwitchSelector, color);
            }

            const nonActiveSelectors = Object.values(activeSelectors)
                .filter((selector) => selector !== activeSwitchSelector)
                .flat();

            nonActiveSelectors.forEach((selector) => {
                setColor(selector, "#595959");
            });

            this.redrawSwitch(activeSwitchSelector);
        }
    }

    redrawSwitch(activeSwitchSelector) {
        // Move the active switch elements to the top of the SVG hierarchy
        const activeElements = this.querySelectorAll(activeSwitchSelector);
        activeElements.forEach((element) => {
            element.parentNode.appendChild(element);
        });
    }



    rotate() {
        const angle = this.rail.getRotationAngle();
        this.style.transform = `rotate(${angle}deg)`;
    }
}

customElements.define('rail-cell', RailCell);