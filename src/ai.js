export default class AI {
  constructor(options) {
    this._options = options

    this.action = this.action.bind(this)
    this.setGameState = this.setGameState.bind(this)

    if(this._options.moveLeft) {
      setInterval(this.action , 400)
    }
  }

  action(){

    this.analyzeView()



    let rand = Math.random()
    switch(true) {
    case rand < 0.25:
      this._options.moveLeft()
      break
    case rand < 0.50:
      this._options.moveRight()
      break
    case rand < 0.75:
      this._options.rotate()
      break
    default:
      this._options.moveDown()
    }
  }

  analyzeView() {
    if(!this._stateUpdated) {
      return
    }

    let body = this._gameState.body
    let heap = []
    let bodyWidth = body[0].length


    for(let y = body.length - 1; y >= 0; y--) {
      let row = body[y]
      let emptyRow = true
      for(let x = 0; x < bodyWidth; x++) {
        if(row[x]) {
          emptyRow = false
        }
      }
      if(!emptyRow) {
        heap.unshift(row)
      }
    }

    console.log(this._gameState)
    console.log(this._trimmedShape)

    this._stateUpdated = false
  }

  setGameState(gameState, shape) {
    this._gameState = gameState
    this._shape = shape
    this._trimmedShape = this._trimShape(shape)
    this._stateUpdated = true
  }

  _trimShape(shape) {
    if(!shape) return
    let trimmedShape = []
    for(let y = shape.paddingTop; y < 5 - shape.paddingBottom; y++) {
      let row = []
      for(let x = shape.paddingLeft; x < 5 - shape.paddingRight; x++) {
        row.push(shape.body[y][x])
      }
      trimmedShape.push(row)
    }

    return trimmedShape
  }
}