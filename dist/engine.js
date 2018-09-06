import Shape from './shape';
import tetraShapes from './shapes/tetra-shapes'

/**
 * Implements the engine of a game
 */

export default class Engine {

  /**
   * Initializing new area
   * @param {*} width is the width of the field of the game in squares
   * @param {*} height is the height of the field of the game in squares
   * @param {*} renderHandle The method that will be runned every time when game state will be changed. 
   * Receives game render data.
   */
  constructor(width = 15, height = 20, renderHandle) {
    if(width <= 0 || height <= 0)
      throw 'Size parameters of the game field are incorrect'

    this.width = width;
    this.height = height;
    this._newFigure();
    this._gameStatus = GAME_STATUS.INIT;

    let body = this.body;
    if(renderHandle) {
      renderHandle(body);
      this._renderHandle = renderHandle;
    }    
  }

  /**
   * Creates new Shape
   */
  _newFigure() {
    this._shape = this._nextShape ? this._nextShape : new Shape(tetraShapes);
    this._nextShape = new Shape(tetraShapes);

    console.log(this._shape);
  }

  /**
   * Running a game or turn off a pause mode
   */
  start() {
    if(this._gameStatus !== GAME_STATUS.INIT && this._gameStatus !== GAME_STATUS.PAUSE)
      throw 'The game has been already runned!';

    if(this._gameStatus == GAME_STATUS.INIT) {
      this._newFigure();
    }

    this._gameStatus = GAME_STATUS.WORK;
    this._cycleId = setTimeout(() => {
      //here must be a gravity emulator function

      //this._renderHandle(this.body);
    }, 1000);    
  }

  /**
   * Turn on a pause mode
   */
  pause() {
    if(this._gameStatus !== GAME_STATUS.WORK)
      throw 'The game isn\'t working!';

    this._gameStatus = GAME_STATUS.PAUSE;
  }

  moveLeft() {
    //if(this._gameStatus !== GAME_STATUS.WORK)
    //  return;

    if(this._canShapeTouchLeftWall())
      return;

    this._shape.position.X--;
    this._renderHandle(this.body);
  }

  moveRight() { 
    //if(this._gameStatus !== GAME_STATUS.WORK)
    //  return;

    if(this._canShapeTouchRightWall())
      return;

    this._shape.position.X++;
    this._renderHandle(this.body);
  }

  moveUp() { 
    //if(this._gameStatus !== GAME_STATUS.WORK)
    //  return;
    
    this._shape.position.Y++;
    this._renderHandle(this.body);
  }
  moveDown() { 
    //if(this._gameStatus !== GAME_STATUS.WORK)
    //  return;
    
    this._shape.position.Y--;
    this._renderHandle(this.body);
  }

  rotate() { 
    //if(this._gameStatus !== GAME_STATUS.WORK)
    //  return;
    
    this._shape.rotate();
    this._renderHandle(this.body);
  }
  rotateBack() { 
    //if(this._gameStatus !== GAME_STATUS.WORK)
    //  return;
    
    this._shape.rotateBack();
    this._renderHandle(this.body);
  }

  _getDeltaX(x) {
    return x - this._shape.position.X;
  }

  _getDeltaY(y) {
      return this._shape.position.Y - y + 4;
  }

  _canShapeTouchLeftWall() {
    return this._shape.position.X + this._shape.paddingLeft - 1 < 0;
  }

  _canShapeTouchRightWall() {
    return this._shape.position.X + 6 - this._shape.paddingRight > this.width;
  }

  _isSquareOfShape(y, x) {
      return this._shape.body[this._getDeltaY(y)] &&
                this._shape.body[this._getDeltaY(y)][this._getDeltaX(x)];
  }

  get body() {
    console.log(44);
    let body = [];
    for (let y = this.height - 1; y >= 0; y--) {
        let row = [];
        for (let x = 0; x < this.width; x++) {

          row.push({
              val: this._isSquareOfShape(y, x) ? 1 : 0,
              x: x,
              y: y
          });
        }
        body.push(row);
    }
    return body;
  }
}

/**
 * Enum represents status of a game
 * 
 * INIT - game was not started
 * WORK - game is running
 * PAUSE - game was timely stopped
 * OVER - game was finished
 */
const GAME_STATUS = {
  INIT: 0,
  WORK: 1,
  PAUSE: 2,
  OVER: 3
}