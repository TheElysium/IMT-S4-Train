// This class is abstract and should not be instantiated directly
// Only inherit from this class plz
// Fuck JS

export class Rail {
    constructor(x, y, orientation) {
      this.x = x;
      this.y = y;
      this.orientation = orientation;
    }
  
    getSvg() {
      // This method should be implemented by the child classes
      throw new Error('getSvg() must be implemented by child classes');
    }
  
    // Shared methods .... Soon ....
  }
  