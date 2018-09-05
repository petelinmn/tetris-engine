
/**
 * Implements the engine of a game
 */

export default class Engine {

  /**
   * Initializing new area
   * @param {*} width is the width of the field of the game in squares
   * @param {*} height is the height of the field of the game in squares
   * @param {*} renderHandle The method that will be runned every time when game state will be changed. 
   * Receives game render data.
   */
 constructor(width = 15, height = 20, renderHandle) {
    if(width <= 0 || height <= 0)
      throw 'Size parameters of the game field are incorrect'

    this.width = width;
    this.height = height;

    let body = this.body;
    if(renderHandle) {
      renderHandle(body);
      this.renderHandle = renderHandle;
    }
 }

setRenderHandle() {
  
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

