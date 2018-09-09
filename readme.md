tetris-engine

Implements Javascript class 
that has commands: start(), moveLeft(), moveRight(), moveDown(), rotate(), rotateBack()
and receive function as a parameter that receive changed state of a game.

let renderFunc = (gameState) => {
 //render tetris game
 //gameState contains status of a game, 2D Array of objects 
 //that specify square of game area and next shape's description

 //You would render your tetris game by using react, vue etc
}

let game = new Engine(areaHeight, areaWidth, renderFunc, defaultHeap, additionalShapes);

For starting game flow need run game.start();
And run cycle that each iteration runs game.moveDown();

game.moveDown();
game.moveLeft(); .. etc..

You can watch sample of use it in https://github.com/petelinmn/tetris-engine-sample

This guide will be extend!