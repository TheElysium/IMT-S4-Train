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

    getRotationAngle() {
        throw new Error('rotate() must be implemented by child classes');
    }

    getPathTo(previous, goal, current = this) {
        const currentRail = {
            from: previous,
            rail: current,
            to: null,
        };
        if (this === goal) {
            return [currentRail];
        } else {
            // A rail has max 2 neighbours (FOR NOW), so we can assume that the next rail is the only one that is not the previous rail
            const next = this.neighbours.filter(n => n !== previous)[0];
            if (next) {
                currentRail.to = next;
                return [currentRail, ...next.getPathTo(current, goal)]
            } else {
                return [currentRail, null];
            }
        }
    }
}
  