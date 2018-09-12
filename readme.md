## tetris-engine 
### is the light-weight javascript library for development custom tetris-game yourself

For development, you will need webpack.

### Get Started

```js
let Engine = require('tetris-engine');
 

  /**
   * Renders your tetris game, function executed every time when state of a game was changed
   * If new coordinates of shape overlap with coordinates of heap 
   * or are outside the game area the shape can't move
   * @param {Object} gameState contains status of a game
   * 1) 2D Array of objects that specify information about each square of a game area.
   * 2) Next shape's description
   * 3) Game status (Init = 0, Work = 1, Pause = 2, Over = 3)
   * 4) Statistic that give you opportunity to charge points for a game
   */
let renderFunc = gameState => {
   //You can render your tetris game by using react, vue etc or
   //use it on server and send render data to client
};
 
//defaultHeap is optional parameter. It represents 2-D array of 0 and 1. 
let defaultHeap = [
   [0, 0, 0, 0, 1, 1, 0],
   [0, 0, 0, 1, 1, 0, 0],
   [0, 0, 1, 1, 1, 1, 0]
];
 
//additionalShapes is optional parameter too. You can set it in the next example:
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
```

You can set appearance for shapes in css, 
but you should specify this classes in rendering took them from gameState

```css
.shape.MyShape1 {
    background-color: red;
}

.heap.MyShape1 {
    background-color: pink;
}

.shape.MyShape2 {
    background-color: blue;
}

.heap.MyShape2 {
    background-color: lightblue;
}
```

### Create the game
```js
let areaHeight = 20;
let areaWidth = 15;

let game = new Engine(
   areaHeight, 
   areaWidth, 
   renderFunc, 
   defaultHeap, 
   additionalShapes
);

//For starting game process need run game.start();
//And run cycle that each iteration runs game.moveDown();
game.start();

let firstLevelInterval = 1000;
setInterval(() => {
   game.moveDown();
}, firstLevelInterval);


// Use
game.rotate();
game.rotateBack();
game.moveRight();
game.moveLeft(); 
game.moveDown();
game.pause();
game.start();

//for game managament
//You even use game.moveUp() for your custom game

```

### You can watch sample of using it with vue.js in 
###     https://codepen.io/peteloid/pen/dqdrYM
###     https://github.com/petelinmn/tetris-engine-sample
