export function visualizePath(coordinates, container) {
    // Remove existing path and points
    const existingPath = container.querySelectorAll(".path");
    const existingPoints = container.querySelectorAll(".point");
    existingPath.forEach((path) => path.remove());
    existingPoints.forEach((point) => point.remove());

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("path");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.position = "absolute";

    svg.style.pointerEvents = "none";

    container.appendChild(svg);

    coordinates.forEach((coordinate, index) => {
        const point = document.createElement('div');
        point.classList.add('point');
        point.style.left = coordinate.y + 'px';
        point.style.top = coordinate.x + 'px';
        point.style.position = 'absolute';
        point.style.width = '10px';
        point.style.height = '10px';
        point.style.backgroundColor = 'blue';
        container.appendChild(point);

        if (index > 0) {
            const previousCoordinate = coordinates[index - 1];
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", previousCoordinate.y);
            line.setAttribute("y1", previousCoordinate.x);
            line.setAttribute("x2", coordinate.y);
            line.setAttribute("y2", coordinate.x);
            line.setAttribute("stroke", "black");
            line.setAttribute("stroke-width", "2");

            svg.appendChild(line);
        }
    });
}

export function getCellPosition(cell) {
    return {
        x: parseInt(cell.dataset.x),
        y: parseInt(cell.dataset.y),
    };
}

export function getCell(x, y, container, type = "") {
    return container.querySelector(
        `.${container.className}__cell[data-x="${x}"][data-y="${y}"] ${type}`
    );
}
