import { Shape, ShapeDimension } from './shape'
import GAME_STATUS from './game-status'

import tetraShapes from './tetra-shapes'

/**
 * Implements the engine of a game
 */

export default class Engine {

  /**
   * Initializing new area
   * @param {Object} options is the container for following options:
   * @param {number} height is the width of the field of the game in squares
   * @param {number} width is the height of the field of the game in squares
   * @param {function} renderHandle The method that will be runned every time
   *                   when game state will be changed. Receives game render data.
   * @param {Array} defaultHeap is a default heap for a game
   * @param {Object} additionalShapes is additionalShapes for a custom game
   */
  constructor(options) {
    if(!options)
      throw new Error('Options not defined')

    if(!options.width || !options.height)
      throw new Error('Size parameters of the game field are incorrect')

    if(!options.renderHandle || typeof options.renderHandle !== 'function')
      throw new Error('renderHandle not defined!')

    this.width = options.width
    this.height = options.height

    if(!options.players || !options.players.isArray())
      this.players = {
        'Player': {
          stat: this._newStatistic()
        }
      }
    else {
      this.players = {}
      for(let i = 0; i < options.players.length; i++) {
        let player = options.players[i]
        if(this.players[player])
          throw new Error('multiple user name!')
        else
          this.players[player] = {
            stat: this._newStatistic()
          }
      }
    }


    this._renderHandle = options.renderHandle

    this._shapesSet = {}
    for(let key in tetraShapes)
      this._shapesSet[key] = tetraShapes[key]

    if(options.additionalShapes)
      for(let key in options.additionalShapes)
        this._shapesSet[key] = options.additionalShapes[key]

    this._gameStatus = GAME_STATUS.INIT

    this._statistic = {
      countShapesFalled: 0,
      countShapesFalledByType: {},
      countLinesReduced: 0,
      countDoubleLinesReduced: 0,
      countTrippleLinesReduced: 0,
      countQuadrupleLinesReduced: 0
    }

    this._heap = []
    if(options.defaultHeap && options.defaultHeap.length && options.defaultHeap[0].length) {

      for(let y = 0; y < options.defaultHeap.length; y++) {
        let row = []
        for(let x = 0; x < this.width; x++) {
          row.push({
            val: 0
          })
        }
        this._heap.push(row)
      }

      let inversedDefaultHeap = options.defaultHeap.slice().reverse()
      for(let y = 0; y < inversedDefaultHeap.length && y < this.height; y++) {
        let row = inversedDefaultHeap[y]
        for(let x = 0; x < row.length && x < this.width; x++) {
          this._heap[y][x].val = inversedDefaultHeap[y][x]
        }
      }
    }

    this._checkHeapForReduce()

    this._renderHandle(this.state)
  }

  static _newStatistic() {
    return {
      countShapesFalled: 0,
      countShapesFalledByType: {},
      countLinesReduced: 0,
      countDoubleLinesReduced: 0,
      countTrippleLinesReduced: 0,
      countQuadrupleLinesReduced: 0
    }
  }

  /**
   * Creates a new Shape
   * @param {*} playerId is id of player, who need receive new shape
   * @returns {void}
   */
  _newFigure(playerId = null) {



    this._shape = this._nextShape ? this._nextShape : new Shape(this._shapesSet, parseInt(this.width / 2 - 3), this.height)
    this._nextShape = new Shape(this._shapesSet, parseInt(this.width / 2 - 3), this.height)

    let countFalledShapesByThisKind = this._statistic.countShapesFalledByType[this._shape.name]
    if(!countFalledShapesByThisKind)
      this._statistic.countShapesFalledByType[this._shape.name] = 1
    else
      this._statistic.countShapesFalledByType[this._shape.name]++

    this._statistic.countShapesFalled++
  }

  /**
   * Running a game or turn off a pause mode
   * @returns {void}
   */
  start() {
    if(this._gameStatus !== GAME_STATUS.INIT && this._gameStatus !== GAME_STATUS.PAUSE)
      return false

    if(this._gameStatus === GAME_STATUS.INIT) {
      this._newFigure()
      this._gameStatus = GAME_STATUS.WORK
      return true
    }

    if(this._gameStatus === GAME_STATUS.PAUSE) {
      this._gameStatus = GAME_STATUS.WORK
    }
  }

  /**
   * Turn on a pause mode
   * @returns {void}
   */
  pause() {
    switch(this._gameStatus) {
    case GAME_STATUS.WORK:
      this._gameStatus = GAME_STATUS.PAUSE
      break
    case GAME_STATUS.PAUSE:
      this._gameStatus = GAME_STATUS.WORK
      break
    }
  }

  moveLeft() {
    if(this._gameStatus !== GAME_STATUS.WORK)
      return

    if(!this._canShapeMove(0, -1))
      return

    this._shape.position.X--
    this._renderHandle(this.state)
  }

  moveRight() {
    if(this._gameStatus !== GAME_STATUS.WORK)
      return

    if(!this._canShapeMove(0, 1))
      return

    this._shape.position.X++
    this._renderHandle(this.state)
  }

  moveUp() {
    if(this._gameStatus !== GAME_STATUS.WORK)
      return

    if(!this._canShapeMove(1, 0))
      return

    this._shape.position.Y++
    this._renderHandle(this.state)
  }

  moveDown() {
    if(this._gameStatus !== GAME_STATUS.WORK)
      return

    if(!this._canShapeMove(-1, 0)) {
      if(!this._addShapeToHeap()) {
        this._gameStatus = GAME_STATUS.OVER
        this._renderHandle(this.state)
      }
      return
    }


    this._shape.position.Y--
    this._renderHandle(this.state)
  }

  _addShapeToHeap() {
    let newRowForHeap = []
    for(let i = 0; i < this.width; i++)
      newRowForHeap.push({
        val: 0
      })

    for(let y = ShapeDimension - 1; y >= 0; y--) {
      let row = this._shape.body[y]
      for(let x = 0; x < ShapeDimension; x++) {
        let cell = row[x]
        if(cell) {
          let areaIndexY = this._getAreaIndexYFromShape(y)

          if(areaIndexY >= this.height) {
            //game over :)
            return false
          }

          while(areaIndexY >= this._heap.length) {
            this._heap.push(newRowForHeap.slice())
          }

          let areaIndexX = this._getAreaIndexXFromShape(x)
          this._heap[areaIndexY][areaIndexX] = {
            val: 1,
            class: this._shape.name
          }
        }
      }
    }

    this._checkHeapForReduce()

    this._newFigure()
    this._renderHandle(this.state)

    return true
  }

  _checkHeapForReduce() {
    let linesToRemove = []
    for(let y = this._heap.length - 1; y >= 0; y--) {
      let row = this._heap[y]
      let isThereEmptySquare = false
      for(let x = 0; x < row.length; x++) {
        if(!this._heap[y][x].val) {
          isThereEmptySquare = true
          break
        }
      }

      if(!isThereEmptySquare)
        linesToRemove.push(y)
    }

    let newHeap = []
    for (let y = 0; y < this._heap.length; y++) {
      if(linesToRemove.indexOf(y) === -1)
        newHeap.push(this._heap[y])
    }

    this._statistic.countLinesReduced += linesToRemove.length
    switch(linesToRemove.length) {
    case 2:
      this._statistic.countDoubleLinesReduced++
      break
    case 3:
      this._statistic.countTrippleLinesReduced++
      break
    case 4:
      this._statistic.countQuadrupleLinesReduced++
      break
    }

    this._heap = newHeap
  }

  rotate() {
    if(this._gameStatus !== GAME_STATUS.WORK)
      return

    if(!this._canShapeMove(0, 0, this._shape.getRotatedBody()))
      return

    this._shape.rotate()
    this._renderHandle(this.state)
  }

  rotateBack() {
    if(this._gameStatus !== GAME_STATUS.WORK)
      return

    if(!this._canShapeMove(0, 0, this._shape.getRotatedBackBody()))
      return

    this._shape.rotateBack()
    this._renderHandle(this.state)
  }

  _getShapeIndexX(x) {
    return x - this._shape.position.X
  }

  _getShapeIndexY(y) {
    return this._shape.position.Y + (ShapeDimension - 1) - y
  }

  _getAreaIndexXFromShape(shapeX, delta = 0) {
    return shapeX + this._shape.position.X + delta
  }

  _getAreaIndexYFromShape(shapeY, delta = 0) {
    return this._shape.position.Y + (ShapeDimension - 1) - shapeY + delta
  }

  /**
   * Specifies that can a shape move.
   * If new coordinates of shape overlap with coordinates of heap
   * or are outside the game area the shape can't move
   * @param {*} deltaY specifies vertical moving distance
   * @param {*} deltaX specifies horizontal moving distance
   * @param {*} shapeBody specifies changed body of a shape, for example rotated body
   * @returns {Boolean} True - shape can moves id parametrized direction, False - shape cannot move
   */
  _canShapeMove(deltaY, deltaX, shapeBody) {
    if(!shapeBody)
      shapeBody = this._shape.body

    for(let y = 0; y < shapeBody.length; y++) {
      let row = shapeBody[y]
      let areaIndexY = this._getAreaIndexYFromShape(y, deltaY)

      for(let x = 0; x < row.length; x++) {
        let cell = row[x]
        if(cell) {
          let areaIndexX = this._getAreaIndexXFromShape(x, deltaX)

          //check will the shape go over the walls and the ground
          if(areaIndexY < 0 || areaIndexX < 0 || areaIndexX >= this.width)
            return false

          if(this._isHeapSquare(areaIndexY, areaIndexX ))
            return false
        }
      }
    }

    return true
  }

  setNextShape(key) {
    switch(key) {
    case 'i':
      this._nextShape = new Shape(this._shapesSet)
      this._nextShape._shape = this._shapesSet["IShape"].slice()
      break
    case 'o':
      this._nextShape = new Shape(this._shapesSet)
      this._nextShape._shape = this._shapesSet["OShape"].slice()
      break
    }
  }

  _isShapeSquare(y, x) {
    if(!this._shape || !this._shape.body)
      return false
    let row = this._shape.body[this._getShapeIndexY(y)]
    return row && row[this._getShapeIndexX(x)]
  }

  _isHeapSquare(y, x) {
    if(!this._heap)
      return false

    return this._heap[y] && this._heap[y][x].val
  }

  _getHeapClass(y, x) {
    if(!this._heap)
      return

    if(!this._heap[y] || !this._heap[y][x].val)
      return

    return this._heap[y][x].class
  }

  _getBody() {
    let body = []
    for (let y = this.height - 1; y >= 0; y--) {
      let row = []
      for (let x = 0; x < this.width; x++) {
        let isHeap = this._isHeapSquare(y, x)
        let isShape = this._isShapeSquare(y, x)
        let val = isHeap ? 2 : isShape ? 1 : 0

        if(!isShape && !isHeap) {
          row.push(0)
        }
        else {

          let newCell = {
            val: val
          }

          let css = []
          if(isShape) {
            css.push('shape')
            css.push(this._shape.name)
          }

          if(isHeap) {
            css.push('heap')
            let heapClass = this._getHeapClass(y, x)
            if(heapClass)
              css.push(heapClass)
          }

          if(css.length) {
            newCell.css = css
          }

          row.push(newCell)
        }
      }
      body.push(row)

    }
    return body
  }

  get state() {
    return {
      gameStatus: this._gameStatus,
      body: this._getBody(),
      shapeName: this._shape ? this._shape.name : null,
      nextShape: {
        name: this._nextShape ? this._nextShape.name : null,
        body: this._nextShape ? this._nextShape.bodyWithAppearance : null,
      },
      statistic: this._statistic
    }
  }
}

