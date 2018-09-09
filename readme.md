tetris-engine

Implements Javascript object 
that receive commands: start(), moveLeft(), moveRight(), moveDown(), rotate(), rotateBack()
and receive function as parameter that receive changed state of a game.

let renderFunc = (gameState) => {
 //render tetris game
}

let game = new Engine(areaHeight, areaWidth, renderFunc, defaultHeap, additionalShapes);

game.moveDown();
game.moveLeft(); .. etc..

You can watch sample of use it in https://github.com/petelinmn/tetris-engine-sample

This guide will be extend!