
/**
 * Implements the area of a game
 */

export default class GameField {

    /**
     * Initializing new area
     * @param {*} width is the width of the field of the game in squares
     * @param {*} height is the height of the field of the game in squares
     */
   constructor(width = 15, height = 20) {
      if(width <= 0 || height <= 0)
        throw 'Size parameters of GameField are incorrect'

      this.width = width;
      this.height = height;
   }

   get body() {
    let body = [];
    for (let j = this.height - 1; j >= 0; j--) {
       let row = [];
       for (let i = 0; i < this.width; i++) {

          row.push({
             val: Math.random() > 0.2 ? 1 : 0,
             i: i,
             j: j
          });
       }
       body.push(row);
    }
    return body;
 }
}

