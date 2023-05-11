export class Menu extends HTMLElement{
    constructor(menu) {
        super();
        this.menu = menu;
        this.position = null;
    }

    connectedCallback() {
        this.style.position = "absolute";
        this.style.display = "none";
        this.style.width = "fit-content";
        this.style.height = "fit-content";
        this.innerHTML = this.menu.getHtml();
    }

    showMenu(x, y, position) {
        this.style.display = "flex";
        const width = this.offsetWidth;
        const height = this.offsetHeight;
        console.log("width", width, "height", height)

        this.style.left = x - width / 2 + "px";
        this.style.top = y - height / 2 + "px";

        this.position = position;
    }

    hideMenu() {
        this.style.display = "none";
    }

    addEventListeners(grid) {
        this.menu.addEventListeners(grid, this);
    }

    removeEventListeners() {
    }
}

customElements.define('menu-rail', Menu);