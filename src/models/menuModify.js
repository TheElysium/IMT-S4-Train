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
            <svg fill="none" height="100" viewBox="0 0 100 100" width="100" xmlns="http://www.w3.org/2000/svg">
                <path d="M85.3742 62.4613C82.6725 70.1292 77.5517 76.7117 70.7829 81.2167C64.0146 85.7217 55.965 87.905 47.8479 87.4379C39.7304 86.9708 31.9848 83.8783 25.7778 78.6267C19.571 73.375 15.2391 66.2483 13.4349 58.3208C11.6308 50.3933 12.452 42.0942 15.7751 34.674C19.0981 27.2538 24.7428 21.1144 31.8587 17.181C38.9745 13.2476 47.1763 11.7331 55.2275 12.8658C68.8213 14.7782 77.8021 24.6309 87.5 33.3333M87.5 33.3333V8.33334M87.5 33.3333H62.5"
                      stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
            </svg>
        </div>
    </li>
    <li class="double" id="remove-rail">
        <div class="icon-double">
            <svg fill="none" height="100" viewBox="0 0 100 100" width="100" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 15L85 85" stroke="black" stroke-width="8"/>
                <path d="M15 85L85 15.2389" stroke="black" stroke-width="8"/>
            </svg>
        </div>
    </li>
</ul>
        `
    }
}