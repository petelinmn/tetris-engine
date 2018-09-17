/**
 * Max dimension of every shape
 */
const ShapeDimension = 5

/**
 * Implements a falling shape
 */
export default class Shape {
  constructor(shapesSet, X = 5, Y = 12) {
    if(!shapesSet)
      throw new Error('Set of shapes was not setted!')

    this._shape = this._selectNextShape(shapesSet)

    this.position = {
      X: X,
      Y: Y
    }

    this.ShapeDimension = 5

    this._calculateProperties()
  }

  /**
      * Selecting next shape from the available set of shapes
      * @param {Object} shapesSet is set of shapes among that need to select
      * @returns {Array} next shape from shapesSet
      * @private
      */
  _selectNextShape(shapesSet) {
    let count = 0
    let selectedShape
    for (let prop in shapesSet) {
      if (Math.random() < 1 / ++count)
        selectedShape = prop
    }

    this.name = selectedShape

    return shapesSet[selectedShape]
  }

  /**
      * Calculating all properties that change when a shape is rotated
      * @private
      * @returns {void}
      */
  _calculateProperties() {
    this._calculatePaddings()
  }

  /**
    * Calculating paddings
    * @returns {void}
  */
  _calculatePaddings() {
    let paddingLeft = ShapeDimension
    let paddingRight = ShapeDimension
    let paddingTop = -1
    let paddingBottom = -1

    for (let y = 0; y < ShapeDimension; y++) {
      for (let x = 0; x < ShapeDimension; x++) {
        if (this._shape[y][x]) {
          if (paddingLeft > x)
            paddingLeft = x

          if (paddingTop < 0)
            paddingTop = y
        }
      }
    }

    for (let y = ShapeDimension - 1; y >= 0; y--) {
      for (let x = ShapeDimension - 1; x >= 0; x--) {
        if (this._shape[y][x]) {
          if (paddingRight > ShapeDimension - 1 - x)
            paddingRight = ShapeDimension - 1 - x

          if (paddingBottom < 0)
            paddingBottom = ShapeDimension - 1 - y
        }
      }
    }

    this._paddingLeft = paddingLeft
    this._paddingRight = paddingRight
    this._paddingTop = paddingTop
    this._paddingBottom = paddingBottom
  }

  /**
      * rotating a shape clockwise
      * @public
      * @returns {void}
      */
  rotate() {
    this._shape = this.getRotatedBody()
    this._calculateProperties()
  }

  getRotatedBody() {
    let newShape = []

    for (let x = 0; x < ShapeDimension; x++) {
      let newRow = []
      for (let y = ShapeDimension - 1; y >= 0; y--) {
        newRow.push(this._shape[y][x])
      }
      newShape.push(newRow)
    }

    return newShape
  }

  /**
      * rotating a shape counterclockwise
      * @public
      * @returns {void}
      */
  rotateBack() {
    this._shape = this.getRotatedBackBody()
    this._calculateProperties()
  }

  getRotatedBackBody() {
    let newShape = []
    for (let x = ShapeDimension - 1; x >= 0; x--) {
      let newRow = []
      for (let y = 0; y < ShapeDimension; y++) {
        newRow.push(this._shape[y][x])
      }
      newShape.push(newRow)
    }

    return newShape
  }

  /**
      * getting actual shape body
      * @public
      */
  get body() {
    return this._shape
  }

  get bodyWithAppearance() {
    let body = []

    for (let x = ShapeDimension - 1; x >= 0; x--) {
      let newRow = []
      for (let y = 0; y < ShapeDimension; y++) {

        let newCell = {
          val: this._shape[y][x]
        }

        if(this._shape[y][x])
          newCell.css = 'shape ' + this.name

        newRow.push(newCell)
      }
      body.push(newRow)
    }

    return body
  }

  /**
      * getting top padding for shape relatively shape's border
      * @public
      */
  get paddingTop() {
    return this._paddingTop
  }

  /**
      * getting bottom padding for shape relatively shape's border
      * @public
      */
  get paddingBottom() {
    return this._paddingBottom
  }

  /**
      * getting right padding for shape relatively shape's border
      * @public
      */
  get paddingRight() {
    return this._paddingRight
  }

  /**
      * getting left padding for shape relatively shape's border
      * @public
      */
  get paddingLeft() {
    return this._paddingLeft
  }
}
