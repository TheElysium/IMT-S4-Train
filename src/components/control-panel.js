export class ControlPanel extends HTMLElement {
    constructor(interactionGrid) {
        super();
        this.interactionGrid = interactionGrid;
        this.musicIsOn = false;
        let svgMusic = document.getElementById("music_svg")
        svgMusic.addEventListener("click", this.music)
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="c-wrapper__ui-container__control-panel">
                <div id="decelerate">
                    <button id="decelerate-button">
                        <svg width="100%" height="100%" viewBox="0 0 50 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.5 19.5981C-0.499999 18.4434 -0.500001 15.5566 1.5 14.4019L25.5 0.545499C27.5 -0.609202 30 0.834173 30 3.14357V30.8564C30 33.1658 27.5 34.6092 25.5 33.4545L1.5 19.5981Z" fill="#EDF8E5"/>
                            <path d="M21.5 19.5981C19.5 18.4434 19.5 15.5566 21.5 14.4019L45.5 0.545499C47.5 -0.609202 50 0.834173 50 3.14357V30.8564C50 33.1658 47.5 34.6092 45.5 33.4545L21.5 19.5981Z" fill="#EDF8E5"/>
                        </svg>
                    </button>
                </div>
                <div id="play-pause-reset">
                    <button id="play-pause-button">
                        <svg id="play-icon" width="100%" height="100%" viewBox="0 0 67 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M62 28.3397C68.6666 32.1887 68.6667 41.8113 62 45.6603L15.5 72.507C8.83336 76.356 0.5 71.5448 0.5 63.8468V10.1532C0.5 2.45524 8.83333 -2.35604 15.5 1.49297L62 28.3397Z" fill="#EDF8E5"/>
                        </svg>
                        <svg id="pause-icon" width="100%" height="100%" viewBox="0 0 67 74" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: none">
                            <path d="M0 9.61039C0 4.30272 4.83821 0 10.8065 0C16.7747 0 21.6129 4.30272 21.6129 9.61039V64.3896C21.6129 69.6973 16.7747 74 10.8065 74C4.83821 74 0 69.6973 0 64.3896V9.61039Z" fill="#EDF8E5"/>
                            <path d="M45.3871 9.61039C45.3871 4.30272 50.2253 0 56.1936 0C62.1618 0 67 4.30272 67 9.61039V64.3896C67 69.6973 62.1618 74 56.1936 74C50.2253 74 45.3871 69.6973 45.3871 64.3896V9.61039Z" fill="#EDF8E5"/>
                        </svg>
                    </button>
                    <button id="reset-button">
                        <svg width="100%" height="100%" viewBox="0 0 59 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 10C0 4.47715 4.47715 0 10 0H49C54.5228 0 59 4.47715 59 10V49C59 54.5228 54.5228 59 49 59H10C4.47715 59 0 54.5228 0 49V10Z" fill="#D7966D"/>
                        </svg>
                    </button>
                </div>
                <div id="accelerate">
                    <button id="accelerate-button">
                        <svg width="100%" height="100%" viewBox="0 0 50 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M28.5 14.4019C30.5 15.5566 30.5 18.4434 28.5 19.5981L4.5 33.4545C2.5 34.6092 0 33.1658 0 30.8564V3.14358C0 0.834176 2.5 -0.609202 4.5 0.545498L28.5 14.4019Z" fill="#EDF8E5"/>
                            <path d="M48.5 14.4019C50.5 15.5566 50.5 18.4434 48.5 19.5981L24.5 33.4545C22.5 34.6092 20 33.1658 20 30.8564V3.14358C20 0.834176 22.5 -0.609202 24.5 0.545498L48.5 14.4019Z" fill="#EDF8E5"/>
                        </svg>
                    </button>
                </div>
            </div>
        `
        this.initEventListeners();
    }

    initEventListeners() {
        this.querySelector("#play-pause-button").addEventListener("click", () => {
            if (this.interactionGrid.isPlaying()) {
                const pauseTimestamp = performance.now();
                this.interactionGrid.pause(pauseTimestamp);
            } else {
                const resumeTimestamp = performance.now();
                this.interactionGrid.play(resumeTimestamp);
            }
            this.update();
        });
        this.querySelector("#reset-button").addEventListener("click", () => {
            this.interactionGrid.reset();
            this.update();
        });
        this.querySelector("#decelerate-button").addEventListener("click", () => {
            this.interactionGrid.decelerate();
        });
        this.querySelector("#accelerate-button").addEventListener("click", () => {
            this.interactionGrid.accelerate();
        });
    }

    update() {
        if (this.interactionGrid.isPlaying()) {
            this.querySelector("#play-icon").style.display = "none";
            this.querySelector("#pause-icon").style.display = "block";
            this.interactionGrid.hideGrid();
        } else {
            this.querySelector("#play-icon").style.display = "block";
            this.querySelector("#pause-icon").style.display = "none";
            this.interactionGrid.showGrid();
        }
    }

    music(){
        let audio = document.getElementById("audio")
        if(this.musicIsOn == true){
            audio.pause();
            audio.currentTime = 0;
            this.musicIsOn = false;
        }else{
            audio.play()
            this.musicIsOn = true;
        }
    }
}

customElements.define("control-panel", ControlPanel);