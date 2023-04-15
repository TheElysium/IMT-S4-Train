// This class is abstract and should not be instantiated directly
// Only inherit from this class plz
// Fuck JS

export class Rail {
    constructor(x, y, orientation) {
        this.x = x;
        this.y = y;
        this.orientation = orientation;
        this.neighbours = [];
    }

    getSvg() {
        // This method should be implemented by the child classes
        throw new Error('getSvg() must be implemented by child classes');
    }

    getPossibleNeighbours(grid) {
        // This method should be implemented by the child classes
        throw new Error('getPossibleNeighbors() must be implemented by child classes');
    }

    canConnect(neighbourRail, grid) {
        return neighbourRail.getPossibleNeighbours(grid).includes(this);
    }

    addNeighbour(rail) {
        this.neighbours.push(rail);
    }

    removeNeighbour(neighbour) {
        this.neighbours = this.neighbours.filter(n => n !== neighbour);
    }
}
  