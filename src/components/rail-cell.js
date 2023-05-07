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
        // Set opacity for each svg elem to 0.5
        const svgElements = svg.querySelectorAll("*");
        svgElements.forEach((element) => {
            element.style.opacity = 0.5;
        });
        this.appendChild(svg);
    }

    updateTrackColor(opacity) {
        if(this.rail instanceof StraightRail || this.rail instanceof TurnRail){
            const tracksRect = this.querySelectorAll("*");
            tracksRect.forEach((track) => {
                if(track.tagName !== "svg") track.style.opacity = opacity;
            });
        }
        else {
            const setOpacity = (selector, opacity) => {
                const elements = this.querySelectorAll(selector);
                elements.forEach((element) => {
                    element.style.opacity = opacity;
                });
            };

            const setTrackOpacity = (trackSelectors, opacity) => {
                trackSelectors.forEach((selector) => {
                    setOpacity(selector, opacity);
                });
            };

            const trackSelectors = [
                ".path-straight",
                ".path-turn1",
                ".path-turn2",
                ".wood-straight-turn2",
                ".wood-straight-turn1",
                ".wood-turn1-turn2",
                ".wood-straight",
            ];

            // Reset
            setTrackOpacity(trackSelectors, 0.5);

            const activeSelectors = {
                [SwitchType.STRAIGHT]: [
                    ".path-straight",
                    ".wood-straight-turn1",
                    ".wood-straight-turn2",
                    ".wood-straight",
                ],
                [SwitchType.TURN_1]: [
                    ".path-turn1",
                    ".wood-straight-turn1",
                    ".wood-turn1-turn2",
                ],
                [SwitchType.TURN_2]: [
                    ".path-turn2",
                    ".wood-straight-turn2",
                    ".wood-turn1-turn2",
                ],
            };

            const activeSwitchSelectors = activeSelectors[this.rail.switchType];

            if (activeSwitchSelectors) {
                setTrackOpacity(activeSwitchSelectors, opacity);
            }
        }
    }


    rotate() {
        const angle = this.rail.getRotationAngle();
        this.style.transform = `rotate(${angle}deg)`;
    }
}

customElements.define('rail-cell', RailCell);