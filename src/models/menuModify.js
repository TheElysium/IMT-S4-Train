export class MenuModify {
    constructor() {
    }

    addEventListeners(grid, component) {
        const rotateRail = document.getElementById('rotate-rail');
        const removeRail = document.getElementById('remove-rail');

        rotateRail.onmouseup = () => {
            grid.rotateRail(component.position);
            component.hideMenu();
        };

        removeRail.onmouseup = () => {
            grid.removeRail(component.position);
            component.hideMenu();
        };

        component.onmouseup = () => {
            component.hideMenu();
        };

        component.onmouseleave = () => {
            component.hideMenu();
        }
    }
    getHtml() {
        return `
        <ul id="circle-double">
    <li class="double" id="rotate-rail">
        <div class="icon-double">
            <svg width="100%" viewBox="0 0 87 92" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M78.8742 60.1279C76.1725 67.7958 71.0517 74.3783 64.2829 78.8833C57.5146 83.3883 49.465 85.5717 41.3479 85.1046C33.2304 84.6375 25.4848 81.545 19.2778 76.2933C13.071 71.0417 8.73909 63.915 6.93492 55.9875C5.13076 48.06 5.95205 39.7608 9.27509 32.3407C12.5981 24.9205 18.2428 18.7811 25.3587 14.8476C32.4745 10.9142 40.6763 9.39971 48.7275 10.5325C62.3213 12.4448 71.3021 22.2976 81 31M81 31V6M81 31H56" stroke="#EDF8E5" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
    </li>
    <li class="double" id="remove-rail">
        <div class="icon-double">
            <svg width="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 15L85 85" stroke="#EDF8E5" stroke-width="12" stroke-linecap="round"/>
            <path d="M15 85L85 15.2389" stroke="#EDF8E5" stroke-width="12" stroke-linecap="round"/>
            </svg>
        </div>
    </li>
</ul>
        `
    }
}