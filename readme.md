## tetris-engine 
### is a light-weight javascript library for developing custom tetris-game yourself

For developing you will need webpack.

let Engine = require('tetris-engine');

//render tetris game
//gameState contains status of a game, 2D Array of objects 
//that specify square of a game area and next shape's description
//there is a information that can be used for render and 
//set different appearance for every square in the game area
let renderFunc = gameState => {
    //You can render your tetris game by using react, vue etc
}

//defaultHeap is optional parameter. It represents 2-D array of 0 and 1. 
let defaultHeap = [
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 0]
]

//additionalShapes is optional parameter too. You can set due to next example:
// later you can set appearance for this shape 
// in css .shape.ShapeName {} and .heap.ShapeName {}...
let additionalShapes = {
    MyShape1: [
       [0, 1, 1, 0, 0],
       [0, 0, 1, 0, 0],
       [0, 0, 1, 0, 0],
       [0, 0, 1, 1, 0],
       [0, 0, 0, 1, 0],
    ],
    MyShape2: [
       [1, 1, 1, 1, 1],
       [0, 1, 1, 1, 0],
       [0, 1, 0, 1, 0],
       [0, 1, 0, 1, 0],
       [0, 1, 0, 1, 0],
    ]
 };

let game = new Engine(areaHeight, areaWidth, renderFunc, defaultHeap, additionalShapes);

//For starting game process need run game.start();
//And run cycle that each iteration runs game.moveDown();

game.start();
setInterval(() => {
    game.moveDown();
}, firstLevelInterval)


### Use
game.rotate();
game.rotateBack();
game.moveRight();
game.moveLeft(); 
game.moveDown();
for game managament
for custom game you even use game.moveUp();

### You can watch sample of use it in https://github.com/petelinmn/tetris-engine-sample

#### This guide will be extend!