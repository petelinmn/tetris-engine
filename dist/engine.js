let Shape = require('./shape').Shape
let ShapeDimension = require('./shape').ShapeDimension

let tetraShapes = require('./tetra-shapes')

/**
 * Implements the engine of a game
 */

class Engine {

  /**
   * Initializing new area
   * @param {number} width is the width of the field of the game in squares
   * @param {number} height is the height of the field of the game in squares
   * @param {function} renderHandle The method that will be runned every time 
   *                   when game state will be changed. Receives game render data.
   * @param {Array} default heap for a game
   */
  constructor(width = 15, height = 20, renderHandle, defaultHeap, additionalShapes) {
    if(width <= 0 || height <= 0)
      throw 'Size parameters of the game field are incorrect'

    this.width = width;
    this.height = height;

    this._shapesSet = {};
    for(let key in tetraShapes)
      this._shapesSet[key] = tetraShapes[key];
      
    if(additionalShapes)
      for(let key in additionalShapes)
        this._shapesSet[key] = additionalShapes[key];

    this._gameStatus = GAME_STATUS.INIT;    

    this._heap = [];
    if(defaultHeap && defaultHeap.length && defaultHeap[0].length) {

      for(let y = 0; y < defaultHeap.length; y++) {
        let row = [];
        for(let x = 0; x < this.width; x++) { 
          row.push({
            val: 0
          });
        }
        this._heap.push(row);
      }

      let inversedDefaultHeap = defaultHeap.slice().reverse();
      for(let y = 0; y < inversedDefaultHeap.length && y < this.height; y++) {
        let row = inversedDefaultHeap[y];
        for(let x = 0; x < row.length && x < this.width; x++) {
          this._heap[y][x].val = inversedDefaultHeap[y][x]
        }
      }
    }

    if(renderHandle) {
      renderHandle(this.state);
      this._renderHandle = renderHandle;
    }
  }

  /**
   * Creates a new Shape
   */
  _newFigure() {
    this._shape = this._nextShape ? this._nextShape : new Shape(this._shapesSet, parseInt(this.width / 2 - 3), this.height);
    this._nextShape = new Shape(this._shapesSet, parseInt(this.width / 2 - 3), this.height);
  }

  /**
   * Running a game or turn off a pause mode
   */
  start() {
    if(this._gameStatus !== GAME_STATUS.INIT && this._gameStatus !== GAME_STATUS.PAUSE)
      return false;

    if(this._gameStatus == GAME_STATUS.INIT) {
      this._newFigure();
      this._gameStatus = GAME_STATUS.WORK;
      return true;
    }
  }

  /**
   * Turn on a pause mode
   */
  pause() {
    if(this._gameStatus !== GAME_STATUS.WORK)
      return false;

    this._gameStatus = GAME_STATUS.PAUSE;
    return true;
  }

  moveLeft() {
    if(this._gameStatus !== GAME_STATUS.WORK)
     return;

    if(!this._canShapeMove(0, -1))
      return;

    this._shape.position.X--;
    this._renderHandle(this.state);
  }

  moveRight() { 
    if(this._gameStatus !== GAME_STATUS.WORK)
     return;

    if(!this._canShapeMove(0, 1))
      return;

    this._shape.position.X++;
    this._renderHandle(this.state);
  }

  moveUp() { 
    if(this._gameStatus !== GAME_STATUS.WORK)
     return;
     
    if(!this._canShapeMove(1, 0))
      return;
    
    this._shape.position.Y++;
    this._renderHandle(this.state);
  }

  moveDown() { 
    if(this._gameStatus !== GAME_STATUS.WORK)
     return;

    if(!this._canShapeMove(-1, 0)) {
      if(!this._addShapeToHeap()) {
        this._gameStatus = GAME_STATUS.OVER;
        this._renderHandle(this.state);
      }
      return;
    }
      
    
    this._shape.position.Y--;
    this._renderHandle(this.state);
  }

  _addShapeToHeap() {
    let newRowForHeap = [];
    for(let i = 0; i < this.width; i++)
      newRowForHeap.push({
        val: 0
      });

    for(let y = ShapeDimension - 1; y >= 0; y--) {
      let row = this._shape.body[y];
      for(let x = 0; x < ShapeDimension; x++) { 
          let cell = row[x];
          if(cell) {
            let areaIndexY = this._getAreaIndexYFromShape(y);
            
            if(areaIndexY >= this.height) {
              //game over :)
              return false;
            }

            while(areaIndexY >= this._heap.length) {
              this._heap.push(newRowForHeap.slice());
            }

            let areaIndexX = this._getAreaIndexXFromShape(x);
            this._heap[areaIndexY][areaIndexX] = {
              val: 1,
              class: this._shape.name
            };
          }
      }
    }

    this._checkHeapForReduce();

    this._newFigure();
    this._renderHandle(this.state);

    return true;
  }

  _checkHeapForReduce() {
    let linesToRemove = [];
    for(let y = this._heap.length - 1; y >= 0; y--) {
      let row = this._heap[y];
      let isThereEmptySquare = false;
      for(let x = 0; x < row.length; x++) { 
        if(!this._heap[y][x].val) {
          isThereEmptySquare = true;
          break;
        }
      }

      if(!isThereEmptySquare)
        linesToRemove.push(y);
    }

    let newHeap = []
    for (let y = 0; y < this._heap.length; y++) {
      if(linesToRemove.indexOf(y) == -1)
        newHeap.push(this._heap[y]);
    }

    this._heap = newHeap;
  }

  rotate() { 
    if(this._gameStatus !== GAME_STATUS.WORK)
     return;
    
    if(!this._canShapeMove(0, 0, this._shape.getRotatedBody()))
      return;
      
    this._shape.rotate();
    this._renderHandle(this.state);
  }

  rotateBack() { 
    if(this._gameStatus !== GAME_STATUS.WORK)
     return;

    if(!this._canShapeMove(0, 0, this._shape.getRotatedBackBody()))
      return;
    
    this._shape.rotateBack();
    this._renderHandle(this.state);
  }

  _getShapeIndexX(x) {
    return x - this._shape.position.X;
  }

  _getShapeIndexY(y) {
    return this._shape.position.Y + (ShapeDimension - 1) - y;
  }

  _getAreaIndexXFromShape(shapeX, delta = 0) {
    return shapeX + this._shape.position.X + delta;
  }

  _getAreaIndexYFromShape(shapeY, delta = 0) {
      return this._shape.position.Y + (ShapeDimension - 1) - shapeY + delta;
  }

  /**
   * Specifies that can a shape move. 
   * If new coordinates of shape overlap with coordinates of heap 
   * or are outside the game area the shape can't move
   * @param {*} deltaY specifies vertical moving distance
   * @param {*} deltaX specifies horizontal moving distance
   * @param {*} shapeBody specifies changed body of a shape, for example rotated body
   */
  _canShapeMove(deltaY, deltaX, shapeBody) {
    if(!shapeBody)
      shapeBody = this._shape.body;

    for(let y = 0; y < shapeBody.length; y++) {
      let row = shapeBody[y];
      let areaIndexY = this._getAreaIndexYFromShape(y, deltaY);
      
      for(let x = 0; x < row.length; x++) {
        let cell = row[x];
        if(cell) {
          let areaIndexX = this._getAreaIndexXFromShape(x, deltaX);

          //check will the shape go over the walls and the ground
          if(areaIndexY < 0 || areaIndexX < 0 || areaIndexX >= this.width)
            return false;

          if(this._isHeapSquare(areaIndexY, areaIndexX ))
            return false;
        }
      }
    }

    return true;
  }

  _isShapeSquare(y, x) {
      if(!this._shape || !this._shape.body)
        return false;
      let row = this._shape.body[this._getShapeIndexY(y)];
      return row && row[this._getShapeIndexX(x)];
  }

  _isHeapSquare(y, x) {
    if(!this._heap)
      return false;

    return this._heap[y] && this._heap[y][x].val;
  }

  _getHeapClass(y, x) {
    if(!this._heap)
      return;

    if(!this._heap[y] || !this._heap[y][x].val)
      return;

    return this._heap[y][x].class;
  }

  _isLeftEdge(y, x) {
    return this._getShapeIndexX(x) == 0 && this._getShapeIndexY(y) >= 0 && this._getShapeIndexY(y) <= 4;
  }

  _isRightEdge(y, x) {
    return this._getShapeIndexX(x) == 4 && this._getShapeIndexY(y) >= 0 && this._getShapeIndexY(y) <= 4;
  }

  _getBody() {
    let body = [];
    for (let y = this.height - 1; y >= 0; y--) {
        let row = [];
        for (let x = 0; x < this.width; x++) {
          let isHeap = this._isHeapSquare(y, x);
          let isShape = this._isShapeSquare(y, x);
          let val = isHeap ? 2 : isShape ? 1 : 0; 

          row.push({
              val: val,
              cssClasses: [
                isShape ? 'shape' : null,
                isHeap ? 'heap' : null,
                isShape ? this._shape.name + '' : null,
                isHeap ? this._getHeapClass(y, x) : null
              ]
          });
        }
        body.push(row);

    }
    return body;
  }

  get state() {
    return {
      gameStatus: this._gameStatus,
      body: this._getBody(),
      shapeName: this._shape ? this._shape.name : null,
      nextShapeName: this._nextShape ? this._nextShape.name : null,
      nextShapeBody: this._nextShape ? this._nextShape.body : null
    }
  }
}

/**
 * Enum represents status of a game
 * 
 * INIT - game was not started
 * WORK - game is running
 * PAUSE - game was temporary stopped
 * OVER - game was finished
 */
const GAME_STATUS = {
  INIT: 0,
  WORK: 1,
  PAUSE: 2,
  OVER: 3
}

module.exports = Engine;