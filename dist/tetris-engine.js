(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["tetrisEngine"] = factory();
	else
		root["tetrisEngine"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/engine.js":
/*!***********************!*\
  !*** ./src/engine.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Engine; });
/* harmony import */ var _shape__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shape */ "./src/shape.js");
/* harmony import */ var _shape__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_shape__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _game_status__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game-status */ "./src/game-status.js");
/* harmony import */ var _tetra_shapes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tetra-shapes */ "./src/tetra-shapes.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




/**
 * Implements the engine of a game
 */

var Engine =
/*#__PURE__*/
function () {
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
  function Engine(options) {
    _classCallCheck(this, Engine);

    if (!options) throw new Error('Options not defined');
    if (!options.width || !options.height) throw new Error('Size parameters of the game field are incorrect');
    if (!options.renderHandle || typeof options.renderHandle !== 'function') throw new Error('renderHandle not defined!');
    this.width = options.width;
    this.height = options.height;
    this._renderHandle = options.renderHandle;
    this._shapesSet = {};

    for (var key in _tetra_shapes__WEBPACK_IMPORTED_MODULE_2__["default"]) {
      this._shapesSet[key] = _tetra_shapes__WEBPACK_IMPORTED_MODULE_2__["default"][key];
    }

    if (options.additionalShapes) for (var _key in options.additionalShapes) {
      this._shapesSet[_key] = options.additionalShapes[_key];
    }
    this._gameStatus = _game_status__WEBPACK_IMPORTED_MODULE_1__["default"].INIT;
    this._statistic = {
      countShapesFalled: 0,
      countShapesFalledByType: {},
      countLinesReduced: 0,
      countDoubleLinesReduced: 0,
      countTrippleLinesReduced: 0,
      countQuadrupleLinesReduced: 0
    };
    this._heap = [];

    if (options.defaultHeap && options.defaultHeap.length && options.defaultHeap[0].length) {
      for (var y = 0; y < options.defaultHeap.length; y++) {
        var row = [];

        for (var x = 0; x < this.width; x++) {
          row.push({
            val: 0
          });
        }

        this._heap.push(row);
      }

      var inversedDefaultHeap = options.defaultHeap.slice().reverse();

      for (var _y = 0; _y < inversedDefaultHeap.length && _y < this.height; _y++) {
        var _row = inversedDefaultHeap[_y];

        for (var _x = 0; _x < _row.length && _x < this.width; _x++) {
          this._heap[_y][_x].val = inversedDefaultHeap[_y][_x];
        }
      }
    }

    this._checkHeapForReduce();

    this._renderHandle(this.state);
  }
  /**
   * Creates a new Shape
   * @returns {void}
   */


  _createClass(Engine, [{
    key: "_newFigure",
    value: function _newFigure() {
      this._shape = this._nextShape ? this._nextShape : new _shape__WEBPACK_IMPORTED_MODULE_0__["Shape"](this._shapesSet, parseInt(this.width / 2 - 3), this.height);
      this._nextShape = new _shape__WEBPACK_IMPORTED_MODULE_0__["Shape"](this._shapesSet, parseInt(this.width / 2 - 3), this.height);
      var countFalledShapesByThisKind = this._statistic.countShapesFalledByType[this._shape.name];
      if (!countFalledShapesByThisKind) this._statistic.countShapesFalledByType[this._shape.name] = 1;else this._statistic.countShapesFalledByType[this._shape.name]++;
      this._statistic.countShapesFalled++;
    }
    /**
     * Running a game or turn off a pause mode
     * @returns {void}
     */

  }, {
    key: "start",
    value: function start() {
      if (this._gameStatus !== _game_status__WEBPACK_IMPORTED_MODULE_1__["default"].INIT && this._gameStatus !== _game_status__WEBPACK_IMPORTED_MODULE_1__["default"].PAUSE) return false;

      if (this._gameStatus === _game_status__WEBPACK_IMPORTED_MODULE_1__["default"].INIT) {
        this._newFigure();

        this._gameStatus = _game_status__WEBPACK_IMPORTED_MODULE_1__["default"].WORK;
        return true;
      }

      if (this._gameStatus === _game_status__WEBPACK_IMPORTED_MODULE_1__["default"].PAUSE) {
        this._gameStatus = _game_status__WEBPACK_IMPORTED_MODULE_1__["default"].WORK;
      }
    }
    /**
     * Turn on a pause mode
     * @returns {void}
     */

  }, {
    key: "pause",
    value: function pause() {
      switch (this._gameStatus) {
        case _game_status__WEBPACK_IMPORTED_MODULE_1__["default"].WORK:
          this._gameStatus = _game_status__WEBPACK_IMPORTED_MODULE_1__["default"].PAUSE;
          break;

        case _game_status__WEBPACK_IMPORTED_MODULE_1__["default"].PAUSE:
          this._gameStatus = _game_status__WEBPACK_IMPORTED_MODULE_1__["default"].WORK;
          break;
      }
    }
  }, {
    key: "moveLeft",
    value: function moveLeft() {
      if (this._gameStatus !== _game_status__WEBPACK_IMPORTED_MODULE_1__["default"].WORK) return;
      if (!this._canShapeMove(0, -1)) return;
      this._shape.position.X--;

      this._renderHandle(this.state);
    }
  }, {
    key: "moveRight",
    value: function moveRight() {
      if (this._gameStatus !== _game_status__WEBPACK_IMPORTED_MODULE_1__["default"].WORK) return;
      if (!this._canShapeMove(0, 1)) return;
      this._shape.position.X++;

      this._renderHandle(this.state);
    }
  }, {
    key: "moveUp",
    value: function moveUp() {
      if (this._gameStatus !== _game_status__WEBPACK_IMPORTED_MODULE_1__["default"].WORK) return;
      if (!this._canShapeMove(1, 0)) return;
      this._shape.position.Y++;

      this._renderHandle(this.state);
    }
  }, {
    key: "moveDown",
    value: function moveDown() {
      if (this._gameStatus !== _game_status__WEBPACK_IMPORTED_MODULE_1__["default"].WORK) return;

      if (!this._canShapeMove(-1, 0)) {
        if (!this._addShapeToHeap()) {
          this._gameStatus = _game_status__WEBPACK_IMPORTED_MODULE_1__["default"].OVER;

          this._renderHandle(this.state);
        }

        return;
      }

      this._shape.position.Y--;

      this._renderHandle(this.state);
    }
  }, {
    key: "_addShapeToHeap",
    value: function _addShapeToHeap() {
      var newRowForHeap = [];

      for (var i = 0; i < this.width; i++) {
        newRowForHeap.push({
          val: 0
        });
      }

      for (var y = _shape__WEBPACK_IMPORTED_MODULE_0__["ShapeDimension"] - 1; y >= 0; y--) {
        var row = this._shape.body[y];

        for (var x = 0; x < _shape__WEBPACK_IMPORTED_MODULE_0__["ShapeDimension"]; x++) {
          var cell = row[x];

          if (cell) {
            var areaIndexY = this._getAreaIndexYFromShape(y);

            if (areaIndexY >= this.height) {
              //game over :)
              return false;
            }

            while (areaIndexY >= this._heap.length) {
              this._heap.push(newRowForHeap.slice());
            }

            var areaIndexX = this._getAreaIndexXFromShape(x);

            this._heap[areaIndexY][areaIndexX] = {
              val: 1,
              class: this._shape.name
            };
          }
        }
      }

      this._checkHeapForReduce();

      this._newFigure();

      this._renderHandle(this.state);

      return true;
    }
  }, {
    key: "_checkHeapForReduce",
    value: function _checkHeapForReduce() {
      var linesToRemove = [];

      for (var y = this._heap.length - 1; y >= 0; y--) {
        var row = this._heap[y];
        var isThereEmptySquare = false;

        for (var x = 0; x < row.length; x++) {
          if (!this._heap[y][x].val) {
            isThereEmptySquare = true;
            break;
          }
        }

        if (!isThereEmptySquare) linesToRemove.push(y);
      }

      var newHeap = [];

      for (var _y2 = 0; _y2 < this._heap.length; _y2++) {
        if (linesToRemove.indexOf(_y2) === -1) newHeap.push(this._heap[_y2]);
      }

      this._statistic.countLinesReduced += linesToRemove.length;

      switch (linesToRemove.length) {
        case 2:
          this._statistic.countDoubleLinesReduced++;
          break;

        case 3:
          this._statistic.countTrippleLinesReduced++;
          break;

        case 4:
          this._statistic.countQuadrupleLinesReduced++;
          break;
      }

      this._heap = newHeap;
    }
  }, {
    key: "rotate",
    value: function rotate() {
      if (this._gameStatus !== _game_status__WEBPACK_IMPORTED_MODULE_1__["default"].WORK) return;
      if (!this._canShapeMove(0, 0, this._shape.getRotatedBody())) return;

      this._shape.rotate();

      this._renderHandle(this.state);
    }
  }, {
    key: "rotateBack",
    value: function rotateBack() {
      if (this._gameStatus !== _game_status__WEBPACK_IMPORTED_MODULE_1__["default"].WORK) return;
      if (!this._canShapeMove(0, 0, this._shape.getRotatedBackBody())) return;

      this._shape.rotateBack();

      this._renderHandle(this.state);
    }
  }, {
    key: "_getShapeIndexX",
    value: function _getShapeIndexX(x) {
      return x - this._shape.position.X;
    }
  }, {
    key: "_getShapeIndexY",
    value: function _getShapeIndexY(y) {
      return this._shape.position.Y + (_shape__WEBPACK_IMPORTED_MODULE_0__["ShapeDimension"] - 1) - y;
    }
  }, {
    key: "_getAreaIndexXFromShape",
    value: function _getAreaIndexXFromShape(shapeX) {
      var delta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      return shapeX + this._shape.position.X + delta;
    }
  }, {
    key: "_getAreaIndexYFromShape",
    value: function _getAreaIndexYFromShape(shapeY) {
      var delta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      return this._shape.position.Y + (_shape__WEBPACK_IMPORTED_MODULE_0__["ShapeDimension"] - 1) - shapeY + delta;
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

  }, {
    key: "_canShapeMove",
    value: function _canShapeMove(deltaY, deltaX, shapeBody) {
      if (!shapeBody) shapeBody = this._shape.body;

      for (var y = 0; y < shapeBody.length; y++) {
        var row = shapeBody[y];

        var areaIndexY = this._getAreaIndexYFromShape(y, deltaY);

        for (var x = 0; x < row.length; x++) {
          var cell = row[x];

          if (cell) {
            var areaIndexX = this._getAreaIndexXFromShape(x, deltaX); //check will the shape go over the walls and the ground


            if (areaIndexY < 0 || areaIndexX < 0 || areaIndexX >= this.width) return false;
            if (this._isHeapSquare(areaIndexY, areaIndexX)) return false;
          }
        }
      }

      return true;
    }
  }, {
    key: "setNextShape",
    value: function setNextShape(key) {
      switch (key) {
        case 'i':
          this._nextShape = new _shape__WEBPACK_IMPORTED_MODULE_0__["Shape"](this._shapesSet);
          this._nextShape._shape = this._shapesSet["IShape"].slice();
          break;

        case 'o':
          this._nextShape = new _shape__WEBPACK_IMPORTED_MODULE_0__["Shape"](this._shapesSet);
          this._nextShape._shape = this._shapesSet["OShape"].slice();
          break;
      }
    }
  }, {
    key: "_isShapeSquare",
    value: function _isShapeSquare(y, x) {
      if (!this._shape || !this._shape.body) return false;

      var row = this._shape.body[this._getShapeIndexY(y)];

      return row && row[this._getShapeIndexX(x)];
    }
  }, {
    key: "_isHeapSquare",
    value: function _isHeapSquare(y, x) {
      if (!this._heap) return false;
      return this._heap[y] && this._heap[y][x].val;
    }
  }, {
    key: "_getHeapClass",
    value: function _getHeapClass(y, x) {
      if (!this._heap) return;
      if (!this._heap[y] || !this._heap[y][x].val) return;
      return this._heap[y][x].class;
    }
  }, {
    key: "_getBody",
    value: function _getBody() {
      var body = [];

      for (var y = this.height - 1; y >= 0; y--) {
        var row = [];

        for (var x = 0; x < this.width; x++) {
          var isHeap = this._isHeapSquare(y, x);

          var isShape = this._isShapeSquare(y, x);

          var val = isHeap ? 2 : isShape ? 1 : 0;

          if (!isShape && !isHeap) {
            row.push(0);
          } else {
            var newCell = {
              val: val
            };
            var css = [];

            if (isShape) {
              css.push('shape');
              css.push(this._shape.name);
            }

            if (isHeap) {
              css.push('heap');

              var heapClass = this._getHeapClass(y, x);

              if (heapClass) css.push(heapClass);
            }

            if (css.length) {
              newCell.css = css;
            }

            row.push(newCell);
          }
        }

        body.push(row);
      }

      return body;
    }
  }, {
    key: "state",
    get: function get() {
      return {
        gameStatus: this._gameStatus,
        body: this._getBody(),
        shapeName: this._shape ? this._shape.name : null,
        nextShape: {
          name: this._nextShape ? this._nextShape.name : null,
          body: this._nextShape ? this._nextShape.bodyWithAppearance : null
        },
        statistic: this._statistic
      };
    }
  }]);

  return Engine;
}();



/***/ }),

/***/ "./src/game-status.js":
/*!****************************!*\
  !*** ./src/game-status.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Enum represents status of a game
 *
 * INIT - game was not started
 * WORK - game is running
 * PAUSE - game was temporary stopped
 * OVER - game was finished
 */
/* harmony default export */ __webpack_exports__["default"] = ({
  INIT: 0,
  WORK: 1,
  PAUSE: 2,
  OVER: 3
});

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: Engine, TetraShapes, GameStatus */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _engine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./engine */ "./src/engine.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Engine", function() { return _engine__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _tetra_shapes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tetra-shapes */ "./src/tetra-shapes.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TetraShapes", function() { return _tetra_shapes__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _game_status__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./game-status */ "./src/game-status.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GameStatus", function() { return _game_status__WEBPACK_IMPORTED_MODULE_2__["default"]; });






/***/ }),

/***/ "./src/shape.js":
/*!**********************!*\
  !*** ./src/shape.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Max dimension of every shape
 */
var ShapeDimension = 5;
/**
 * Implements a falling shape
 */

var Shape =
/*#__PURE__*/
function () {
  function Shape(shapesSet) {
    var X = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
    var Y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 12;

    _classCallCheck(this, Shape);

    if (!shapesSet) throw new Error('Set of shapes was not setted!');
    this._shape = this._selectNextShape(shapesSet);
    this.position = {
      X: X,
      Y: Y
    };

    this._calculateProperties();
  }
  /**
      * Selecting next shape from the available set of shapes
      * @param {Object} shapesSet is set of shapes among that need to select
      * @returns {Array} next shape from shapesSet
      * @private
      */


  _createClass(Shape, [{
    key: "_selectNextShape",
    value: function _selectNextShape(shapesSet) {
      var count = 0;
      var selectedShape;

      for (var prop in shapesSet) {
        if (Math.random() < 1 / ++count) selectedShape = prop;
      }

      this.name = selectedShape;
      return shapesSet[selectedShape];
    }
    /**
        * Calculating all properties that change when a shape is rotated
        * @private
        * @returns {void}
        */

  }, {
    key: "_calculateProperties",
    value: function _calculateProperties() {
      this._calculatePaddings();
    }
    /**
      * Calculating paddings
      * @returns {void}
    */

  }, {
    key: "_calculatePaddings",
    value: function _calculatePaddings() {
      var paddingLeft = ShapeDimension;
      var paddingRight = ShapeDimension;
      var paddingTop = -1;
      var paddingBottom = -1;

      for (var y = 0; y < ShapeDimension; y++) {
        for (var x = 0; x < ShapeDimension; x++) {
          if (this._shape[y][x]) {
            if (paddingLeft > x) paddingLeft = x;
            if (paddingTop < 0) paddingTop = y;
          }
        }
      }

      for (var _y = ShapeDimension - 1; _y >= 0; _y--) {
        for (var _x = ShapeDimension - 1; _x >= 0; _x--) {
          if (this._shape[_y][_x]) {
            if (paddingRight > ShapeDimension - 1 - _x) paddingRight = ShapeDimension - 1 - _x;
            if (paddingBottom < 0) paddingBottom = ShapeDimension - 1 - _y;
          }
        }
      }

      this._paddingLeft = paddingLeft;
      this._paddingRight = paddingRight;
      this._paddingTop = paddingTop;
      this._paddingBottom = paddingBottom;
    }
    /**
        * rotating a shape clockwise
        * @public
        * @returns {void}
        */

  }, {
    key: "rotate",
    value: function rotate() {
      this._shape = this.getRotatedBody();

      this._calculateProperties();
    }
  }, {
    key: "getRotatedBody",
    value: function getRotatedBody() {
      var newShape = [];

      for (var x = 0; x < ShapeDimension; x++) {
        var newRow = [];

        for (var y = ShapeDimension - 1; y >= 0; y--) {
          newRow.push(this._shape[y][x]);
        }

        newShape.push(newRow);
      }

      return newShape;
    }
    /**
        * rotating a shape counterclockwise
        * @public
        * @returns {void}
        */

  }, {
    key: "rotateBack",
    value: function rotateBack() {
      this._shape = this.getRotatedBackBody();

      this._calculateProperties();
    }
  }, {
    key: "getRotatedBackBody",
    value: function getRotatedBackBody() {
      var newShape = [];

      for (var x = ShapeDimension - 1; x >= 0; x--) {
        var newRow = [];

        for (var y = 0; y < ShapeDimension; y++) {
          newRow.push(this._shape[y][x]);
        }

        newShape.push(newRow);
      }

      return newShape;
    }
    /**
        * getting actual shape body
        * @public
        */

  }, {
    key: "body",
    get: function get() {
      return this._shape;
    }
  }, {
    key: "bodyWithAppearance",
    get: function get() {
      var body = [];

      for (var x = ShapeDimension - 1; x >= 0; x--) {
        var newRow = [];

        for (var y = 0; y < ShapeDimension; y++) {
          var newCell = {
            val: this._shape[y][x]
          };
          if (this._shape[y][x]) newCell.css = 'shape ' + this.name;
          newRow.push(newCell);
        }

        body.push(newRow);
      }

      return body;
    }
    /**
        * getting top padding for shape relatively shape's border
        * @public
        */

  }, {
    key: "paddingTop",
    get: function get() {
      return this._paddingTop;
    }
    /**
        * getting bottom padding for shape relatively shape's border
        * @public
        */

  }, {
    key: "paddingBottom",
    get: function get() {
      return this._paddingBottom;
    }
    /**
        * getting right padding for shape relatively shape's border
        * @public
        */

  }, {
    key: "paddingRight",
    get: function get() {
      return this._paddingRight;
    }
    /**
        * getting left padding for shape relatively shape's border
        * @public
        */

  }, {
    key: "paddingLeft",
    get: function get() {
      return this._paddingLeft;
    }
  }]);

  return Shape;
}();

module.exports = {
  Shape: Shape,
  ShapeDimension: ShapeDimension
};

/***/ }),

/***/ "./src/tetra-shapes.js":
/*!*****************************!*\
  !*** ./src/tetra-shapes.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  IShape: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [1, 1, 1, 1, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
  ZShape: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 1, 1, 0, 0], [0, 0, 1, 1, 0], [0, 0, 0, 0, 0]],
  SShape: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 1, 1, 0], [0, 1, 1, 0, 0], [0, 0, 0, 0, 0]],
  LShape: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 1, 1, 1, 0], [0, 1, 0, 0, 0], [0, 0, 0, 0, 0]],
  JShape: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 1, 1, 1, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 0]],
  OShape: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 1, 1, 0, 0], [0, 1, 1, 0, 0], [0, 0, 0, 0, 0]],
  TShape: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 1, 1, 1, 0], [0, 0, 1, 0, 0], [0, 0, 0, 0, 0]]
});

/***/ })

/******/ });
});
//# sourceMappingURL=tetris-engine.js.map