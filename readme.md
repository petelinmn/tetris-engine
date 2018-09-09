tetris-engine project

Impelements Javascript object 
that receive commands: start(), moveLeft(), moveRight(), moveDown(), rotate(), rotateBack()
and receive Function as parameter that receive changed state of a game.

let renderFunc = (gameBody) => {
 //rener tetris game
}

let game = new Engine(areaHeight, areaWidth, renderFunc, defaultHeap, additionalShapes);

game.moveDown();
game.moveLeft(); .. etc..


