import Shape from './shape'
import GAME_STATUS from './game-status'

import tetraShapes from './tetra-shapes'

const ShapeDimension = 5

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

    let self = this
    this.width = options.width
    this.height = options.height

    this._players = options.players

    if(!options.players)
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
            name: player,
            stat: self._newStatistic()
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

    this._statistic = this._newStatistic()

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

  _newStatistic() {
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
   * @param {*} playerName is name of player, who need receive new shape
   * @returns {void}
   */
  _newShape(playerName = null) {
    let playerIndex = 0
    for (let name in this.players) {
      playerIndex++
      if(!playerName || name === playerName) {
        let player = this.players[name]
        let displayPart = parseInt(playerIndex * (this.width / (this._players.length + 1)) - 1)
        player.shape = player.nextShape ? player.nextShape : new Shape(this._shapesSet, displayPart, this.height)
        player.nextShape = new Shape(this._shapesSet, displayPart, this.height)

        let countShapesFalledByType = player.stat.countShapesFalledByType[player.shape.name]
        if(!countShapesFalledByType)
          player.stat.countShapesFalledByType[player.shape.name] = 1
        else
          player.stat.countShapesFalledByType[player.shape.name]++


        player.stat.countShapesFalled++

        countShapesFalledByType = this._statistic.countShapesFalledByType[player.shape.name]
        if(!countShapesFalledByType)
          this._statistic.countShapesFalledByType[player.shape.name] = 1
        else
          this._statistic.countShapesFalledByType[player.shape.name]++

        this._statistic.countShapesFalled++
      }
    }
  }

  /**
   * Running a game or turn off a pause mode
   * @returns {void}
   */
  start() {
    if(this._gameStatus !== GAME_STATUS.INIT && this._gameStatus !== GAME_STATUS.PAUSE)
      return false

    if(this._gameStatus === GAME_STATUS.INIT) {
      this._newShape()
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

  moveLeft(playerName = 'Player') {
    if(this._gameStatus !== GAME_STATUS.WORK)
      return

    let player = this._getPlayerByName(playerName)
    if(this._canShapeMove(playerName, 0, -1) <= 0)
      return

    player.shape.position.X--
    this._renderHandle(this.state)
  }

  moveRight(playerName = 'Player') {
    if(this._gameStatus !== GAME_STATUS.WORK)
      return

    let player = this._getPlayerByName(playerName)
    if(this._canShapeMove(playerName, 0, 1) <= 0)
      return

    player.shape.position.X++
    this._renderHandle(this.state)
  }

  moveUp(playerName = 'Player') {
    if(this._gameStatus !== GAME_STATUS.WORK)
      return

    let player = this._getPlayerByName(playerName)
    if(this._canShapeMove(playerName, 1, 0) <= 0)
      return

    player.shape.position.Y++
    this._renderHandle(this.state)
  }

  moveDown(playerName = 'Player') {
    if(this._gameStatus !== GAME_STATUS.WORK)
      return

    let player = this._getPlayerByName(playerName)
    let canShapeMoveResult = this._canShapeMove(playerName, -1, 0)

    if(canShapeMoveResult === -1) {
      return
    }

    if(!canShapeMoveResult) {
      if(!this._addShapeToHeap(player)) {
        //this._gameStatus = GAME_STATUS.OVER
        this._renderHandle(this.state)
      }
      return
    }

    player.shape.position.Y--
    this._renderHandle(this.state)
  }

  moveDownAll() {
    if(this._gameStatus !== GAME_STATUS.WORK) {
      return
    }

    let movedDownPlayers = {}
    for(let name in this.players) {
      movedDownPlayers[name] = false
    }

    let fuse = 0
    console.log('perpetual cycle')
    for (;;) {
      if(++fuse > 1000) {
        console.error('fuse tripped')
        break
      }

      let countMovedShapes = 0
      for(let name in movedDownPlayers) {
        if(movedDownPlayers[name])
          countMovedShapes++
      }

      let allShapesMoved = true
      for(let name in movedDownPlayers) {
        if(!movedDownPlayers[name]) {
          let result = this._canShapeMove(name, -1, 0)
          if(result === true) {
            this.players[name].shape.position.Y--
            movedDownPlayers[name] = true
          } else if(result === false) {
            this._addShapeToHeap(this._getPlayerByName(name))
            if(countMovedShapes === this._players.length - 1) {
              this._gameStatus = GAME_STATUS.OVER
            }

            allShapesMoved = false
          } else {
            allShapesMoved = false
          }
        }
      }

      if(allShapesMoved || this._gameStatus === GAME_STATUS.OVER)
        break
    }

    this._renderHandle(this.state)
  }

  rotate(playerName = 'Player') {
    if(this._gameStatus !== GAME_STATUS.WORK)
      return

    let player = this._getPlayerByName(playerName)
    if(this._canShapeMove(playerName, 0, 0, player.shape.getRotatedBody()) <= 0)
      return

    player.shape.rotate()
    this._renderHandle(this.state)
  }

  rotateBack(playerName = 'Player') {
    if(this._gameStatus !== GAME_STATUS.WORK)
      return

    let player = this._getPlayerByName(playerName)
    if(!this._canShapeMove(playerName, 0, 0, player.shape.getRotatedBackBody()) <= 0)
      return

    player.shape.rotateBack()
    this._renderHandle(this.state)
  }


  _addShapeToHeap(player) {
    let newRowForHeap = []
    for(let i = 0; i < this.width; i++)
      newRowForHeap.push({
        val: 0
      })

    for(let y = ShapeDimension - 1; y >= 0; y--) {
      let row = player.shape.body[y]
      for(let x = 0; x < ShapeDimension; x++) {
        let cell = row[x]
        if(cell) {
          let areaIndexY = this._getAreaIndexYFromShape(player.shape, y)

          if(areaIndexY >= this.height) {
            //game over :)
            return false
          }

          while(areaIndexY >= this._heap.length) {
            this._heap.push(newRowForHeap.slice())
          }

          let areaIndexX = this._getAreaIndexXFromShape(player.shape, x)
          this._heap[areaIndexY][areaIndexX] = {
            val: 1,
            class: player.shape.name
          }
        }
      }
    }

    this._checkHeapForReduce()

    this._newShape(player.name)
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

  _getShapeIndexX(shape, x) {
    return x - shape.position.X
  }

  _getShapeIndexY(shape, y) {
    return shape.position.Y + (ShapeDimension - 1) - y
  }

  _getAreaIndexXFromShape(shape, shapeX, delta = 0) {
    return shapeX + shape.position.X + delta
  }

  _getAreaIndexYFromShape(shape, shapeY, delta = 0) {
    return shape.position.Y + (ShapeDimension - 1) - shapeY + delta
  }

  _getPlayerByName(playerName = 'Player') {
    for(let name in this.players) {
      if(name === playerName) {
        return this.players[name]
      }
    }
  }

  /**
   * Specifies that can a shape move.
   * If new coordinates of shape overlap with coordinates of heap
   * or are outside the game area the shape can't move
   * @param {*} playerName unique name of a player who tries to move his shape
   * @param {*} deltaY specifies vertical moving distance
   * @param {*} deltaX specifies horizontal moving distance
   * @param {*} shapeBody specifies changed body of a shape, for example rotated body
   * @returns {Boolean} True - shape can moves id parametrized direction, False - shape cannot move
   */
  _canShapeMove(playerName, deltaY, deltaX, shapeBody) {
    let player = this._getPlayerByName(playerName)
    if(!shapeBody) {
      shapeBody = player.shape.body
    }

    for(let y = 0; y < shapeBody.length; y++) {
      let row = shapeBody[y]
      let areaIndexY = this._getAreaIndexYFromShape(player.shape, y, deltaY)

      for(let x = 0; x < row.length; x++) {
        if(!row[x]){
          continue
        }

        let areaIndexX = this._getAreaIndexXFromShape(player.shape, x, deltaX)

        //check will the shape go over the walls
        if(areaIndexY < 0 || areaIndexX < 0 || areaIndexX >= this.width) {
          return false
        }

        if(this._isHeapSquare(areaIndexY, areaIndexX)) {
          return deltaY < 0 ? false : -1
        }

        if(this.players.length === 1) {
          return true
        }

        for(let name in this.players) {
          let curPlayer = this.players[name]
          if(curPlayer === player) {
            continue
          }

          for(let shapeY = 0; shapeY < ShapeDimension; shapeY++) {
            let curAreaIndexY = this._getAreaIndexYFromShape(curPlayer.shape, shapeY, 0)
            if(curAreaIndexY !== areaIndexY)
              continue
            for(let shapeX = 0; shapeX < ShapeDimension; shapeX++) {
              let curAreaIndexX = this._getAreaIndexXFromShape(curPlayer.shape, shapeX, 0)
              if(curAreaIndexX === areaIndexX && curPlayer.shape.body[shapeY][shapeX])
                return -1
            }
          }
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

  _getShapeInSquare(y, x) {
    for(let name in this.players) {
      let player = this.players[name]
      if(!player.shape)
        return
      let row = player.shape.body[this._getShapeIndexY(player.shape, y)]
      if(row && row[this._getShapeIndexX(player.shape, x)])
        return player.shape
    }

    return null
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
        let shape = this._getShapeInSquare(y, x)
        let isShape = !!shape
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
            css.push(shape.name)
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



    let playData = []
    if(this.players.length === 1) {
      let shape = this.players['Player'].shape
      let nextShape = this.players['Player'].nextShape

      playData = {
        shapeName: shape ? shape.name : null,
        nextShape: {
          name: nextShape ? nextShape.name : null,
          body: nextShape ? nextShape.bodyWithAppearance : null,
        },
        statistic: this._statistic
      }
    } else {
      for(let name in this.players) {
        let player = this.players[name]

        playData.push({
          shapeName: player.shape ? player.shape.name : null,
          nextShape: {
            name: player.nextShape ? player.nextShape.name : null,
            body: player.nextShape ? player.nextShape.bodyWithAppearance : null,
          },
          statistic: this._statistic
        })
      }
    }

    return {
      gameStatus: this._gameStatus,
      body: this._getBody(),
      playData: playData
    }
  }
}

