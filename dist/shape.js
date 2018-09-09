/**
 * Max dimension of every shape
 */
const ShapeDimension = 5;

/**
 * Implements a falling shape
 */
class Shape {
    constructor(shapesSet, X = 5, Y = 12) {
        if(!shapesSet)
            console.error('Set of shapes was not setted!')

        this._shape = this._selectNextShape(shapesSet);

        this.position = {
           X: X,
           Y: Y
        };

        this._calculateProperties();
     }

     /**
      * Selecting next shape from the available set of shapes
      * @private
      */
     _selectNextShape(shapesSet) {
        let count = 0;
        let selectedShape;
        for (let prop in shapesSet) {
           if (Math.random() < 1 / ++count)
              selectedShape = prop;
        }
        
        this.name = selectedShape;

        return shapesSet[selectedShape];
     }

     /**
      * Calculating all properties that change when a shape is rotated
      * @private
      */
     _calculateProperties() {
        this._calculatePaddings();
     }

     /**
      * Calculating paddings
      */
     _calculatePaddings() {
        let paddingLeft = ShapeDimension;
        let paddingRight = ShapeDimension;
        let paddingTop = -1;
        let paddingBottom = -1;
  
        for (let y = 0; y < ShapeDimension; y++) {
           for (let x = 0;  x < ShapeDimension; x++) {
              if (this._shape[y][x]) {
                if (paddingLeft > x)
                   paddingLeft = x;

                if (paddingTop < 0) 
                     paddingTop = y;
              }
           }
        }
  
        for (let y = ShapeDimension - 1; y >= 0; y--) {
           for (let x = ShapeDimension - 1;  x >= 0; x--) {
              if (this._shape[y][x]) {
                if (paddingRight > ShapeDimension - 1 - x)
                    paddingRight = ShapeDimension - 1 - x;
  
                if (paddingBottom < 0)
                    paddingBottom = ShapeDimension - 1 - y;
              }
           }
        }
  
        this._paddingLeft = paddingLeft;
        this._paddingRight = paddingRight;
        this._paddingTop = paddingTop;
        this._paddingBottom = paddingBottom;
     }

     /**
      * rotating a shape clockwise
      * @public
      */
     rotate() {  
        this._shape = this.getRotatedBody();
        this._calculateProperties();
     }

     getRotatedBody() {
        let newShape = [];
  
        for (let x = 0;  x < ShapeDimension; x++) {
           let newRow = [];
           for (let y = ShapeDimension - 1; y >= 0; y--) {
              newRow.push(this._shape[y][x]);
           }
           newShape.push(newRow);
        }

        return newShape;
     }
  
     /**
      * rotating a shape counterclockwise
      * @public
      */
     rotateBack() {
        this._shape = this.getRotatedBackBody();
        this._calculateProperties();
     }

     getRotatedBackBody() {
        let newShape = [];
        for (let x = ShapeDimension - 1;  x >= 0; x--) {
           let newRow = [];
           for (let y = 0; y < ShapeDimension; y++) {
              newRow.push(this._shape[y][x]);
           }
           newShape.push(newRow);
        }

        return newShape;
     }

     /**
      * getting actual shape body
      * @public
      */
     get body() {
        return this._shape;
     }
  
     /**
      * getting top padding for shape relatively shape's border
      * @public
      */
     get paddingTop() {
        return this._paddingTop;
     }
  
    /**
      * getting bottom padding for shape relatively shape's border
      * @public
      */
     get paddingBottom() {
        return this._paddingBottom;
     }
  
    /**
      * getting right padding for shape relatively shape's border
      * @public
      */
     get paddingRight() {
        return this._paddingRight;
     }

    /**
      * getting left padding for shape relatively shape's border
      * @public
      */
     get paddingLeft() {
        return this._paddingLeft;
     }
}

module.exports = {
    Shape,
    ShapeDimension
};