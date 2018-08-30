const TetraShapes = require('./shapes/tetra-shapes.js')

class Engine {
   init() {
      console.log('Hello from tetris-engine! v 1.0.8!');

      console.log(TetraShapes);
   }
}

module.exports = Engine;
