let shapeSet = require('../dist/shapes/tetra-shapes');
let Shape = require('../dist/shape').Shape;

let shape = new Shape(shapeSet);

console.log(shape);
shape.rotate();

console.log(shape);
shape.rotateBack();