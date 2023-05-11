export class MenuAdd {
    constructor() {
    }

    addEventListeners(grid, component) {
        const addStraightRail = document.getElementById('add-straight-rail');
        const addSwitchRail = document.getElementById('add-switch-rail');
        const addTurnRail = document.getElementById('add-turn-rail');

        addStraightRail.onmouseup = () => {
            grid.addStraightRail(component.position);
            component.hideMenu();
        };

        addTurnRail.onmouseup = () => {
            grid.addTurnRail(component.position);
            component.hideMenu();
        };

        addSwitchRail.onmouseup = () => {
            grid.addSwitchRail(component.position);
            component.hideMenu();
        }

        component.onmouseup = () => {
            component.hideMenu();
        };

        component.onmouseleave = () => {
            component.hideMenu();
        };
    }

    getHtml() {
        return `
        <ul id="circle-triple">
            <li class="triple" id="add-straight-rail">
                <div class="icon-triple">
                    <svg fill="none" height="100%" viewBox="0 0 500 500" width="100%" xmlns="http://www.w3.org/2000/svg">
                        <rect fill="#964415" height="98" transform="rotate(-180 423 299)" width="15" x="423" y="299"/>
                        <rect fill="#964415" height="98" transform="rotate(-180 368 299)" width="15" x="368" y="299"/>
                        <rect fill="#964415" height="98" transform="rotate(-180 478 299)" width="15" x="478" y="299"/>
                        <rect fill="#964415" height="98" transform="rotate(-180 258 299)" width="15" x="258" y="299"/>
                        <rect fill="#964415" height="98" transform="rotate(-180 203 299)" width="15" x="203" y="299"/>
                        <rect fill="#964415" height="98" transform="rotate(-180 313 299)" width="15" x="313" y="299"/>
                        <rect fill="#964415" height="98" transform="rotate(-180 93 299)" width="15" x="93" y="299"/>
                        <rect fill="#964415" height="98" transform="rotate(-180 38 299)" width="15" x="38" y="299"/>
                        <rect fill="#964415" height="98" transform="rotate(-180 148 299)" width="15" x="148" y="299"/>
                        <rect fill="#595959" height="500" transform="rotate(-90 0 291)" width="15" y="291"/>
                        <rect fill="#595959" height="500" transform="rotate(-90 0 223)" width="15" y="223"/>
                    </svg>
                </div>
            </li>
            <li class="triple" id="add-switch-rail">
                <div class="icon-triple">
                    <svg fill="none" height="100%" viewBox="0 0 501 500" width="100%" xmlns="http://www.w3.org/2000/svg">
                        <rect fill="#964415" height="98" width="15" x="77" y="201"/>
                        <rect fill="#964415" height="98" width="15" x="132" y="201"/>
                        <rect fill="#964415" height="98" width="15" x="22" y="201"/>
                        <rect fill="#964415" height="98" width="15" x="242" y="201"/>
                        <rect fill="#964415" height="98" width="15" x="297" y="201"/>
                        <rect fill="#964415" height="98" width="15" x="187" y="201"/>
                        <rect fill="#964415" height="98" width="15" x="407" y="201"/>
                        <rect fill="#964415" height="98" width="15" x="462" y="201"/>
                        <rect fill="#964415" height="98" width="15" x="352" y="201"/>
                        <rect fill="#964415" height="98" transform="rotate(-90 200.5 92.5)" width="15" x="200.5" y="92.5"/>
                        <rect fill="#964415" height="98" transform="rotate(-90 200.5 37.5)" width="15" x="200.5" y="37.5"/>
                        <rect fill="#964415" height="98" transform="rotate(-90 200.5 147.5)" width="15" x="200.5" y="147.5"/>
                        <rect fill="#595959" height="108" transform="rotate(90 108 209)" width="15" x="108" y="209"/>
                        <rect fill="#595959" height="142" transform="rotate(90 142 277)" width="15" x="142" y="277"/>
                        <rect fill="#595959" height="143" transform="rotate(180 292 143)" width="15" x="292" y="143"/>
                        <rect fill="#595959" height="108.761" transform="rotate(180 224 108.761)" width="15" x="224"
                              y="108.761"/>
                        <path d="M216.5 107.5C216.5 137.646 212.292 173.908 192.5 193.5C173.132 212.672 137.5 216.5 108 216.5"
                              stroke="#595959" stroke-width="15"/>
                        <path d="M142 284.5C179.661 284.5 214.779 269.039 241.409 242.409C268.039 215.779 284.5 180.661 284.5 143"
                              stroke="#595959" stroke-width="15"/>
                        <rect fill="#595959" height="108" transform="matrix(0 1 1 0 393 209)" width="15"/>
                        <rect fill="#595959" height="142" transform="matrix(0 1 1 0 359 277)" width="15"/>
                        <rect fill="#595959" height="143" transform="matrix(1 0 0 -1 209 143)" width="15"/>
                        <rect fill="#595959" height="108.761" transform="matrix(1 0 0 -1 277 108.761)" width="15"/>
                        <path d="M284.5 107.5C284.5 137.646 288.708 173.908 308.5 193.5C327.868 212.672 363.5 216.5 393 216.5"
                              stroke="#595959" stroke-width="15"/>
                        <path d="M359 284.5C321.339 284.5 286.221 269.039 259.591 242.409C232.961 215.779 216.5 180.661 216.5 143"
                              stroke="#595959" stroke-width="15"/>
                        <rect fill="#595959" height="500" transform="rotate(90 500 209)" width="15" x="500" y="209"/>
                        <rect fill="#595959" height="500" transform="rotate(90 500 277)" width="15" x="500" y="277"/>
                    </svg>
                </div>
            </li>
            <li class="triple" id="add-turn-rail">
                <div class="icon-triple">
                    <svg fill="none" height="100%" viewBox="0 0 500 500" width="100%" xmlns="http://www.w3.org/2000/svg">
                        <rect fill="#964415" height="98" width="15" x="77.5" y="200.5"/>
                        <rect fill="#964415" height="98" transform="rotate(8.85407 140.131 201.93)" width="15" x="140.131"
                              y="201.93"/>
                        <rect fill="#964415" height="98" transform="rotate(27.8927 210.743 218)" width="15" x="210.743"
                              y="218"/>
                        <rect fill="#964415" height="98" transform="rotate(68.1153 278.457 281.304)" width="15" x="278.457"
                              y="281.304"/>
                        <rect fill="#964415" height="98" width="15" x="22.5" y="200.5"/>
                        <rect fill="#964415" height="98" transform="rotate(-90 201 422)" width="15" x="201" y="422"/>
                        <rect fill="#964415" height="98" transform="rotate(-97.3252 202.356 373.186)" width="15" x="202.356"
                              y="373.186"/>
                        <rect fill="#964415" height="98" transform="rotate(-90 201 477)" width="15" x="201" y="477"/>
                        <rect fill="#595959" height="108" width="15" x="209" y="392"/>
                        <rect fill="#595959" height="142" width="15" x="277" y="358"/>
                        <rect fill="#595959" height="143" transform="rotate(90 143 208)" width="15" x="143" y="208"/>
                        <rect fill="#595959" height="108.761" transform="rotate(90 108.76 276)" width="15" x="108.76" y="276"/>
                        <path d="M107.5 283.5C137.646 283.5 173.908 287.708 193.5 307.5C212.672 326.868 216.5 362.5 216.5 392"
                              stroke="#595959" stroke-width="15"/>
                        <path d="M284.5 358C284.5 320.339 269.039 285.221 242.409 258.591C215.779 231.961 180.661 215.5 143 215.5"
                              stroke="#595959" stroke-width="15"/>
                    </svg>
                </div>
            </li>
        </ul>
        `
    }
}