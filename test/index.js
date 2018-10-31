
let Engine = tetrisEngine.Engine

let App = new Vue({
  template:
        `
        <div class="control-container">
          <div class="game-container">
            <table class="game-table">
                <tbody>
                    <tr v-for="row in gameState.body">
                        <td v-for="cell in row"
                            v-bind:class="cell.css">
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="right-content">
              <div v-if="gameState.playData[0].nextShape">
                  <table class="shape-table">
                      <tbody>
                          <tr v-for="row in gameState.playData[0].nextShape.body">
                              <td v-for="cell in row"
                                  v-bind:class="cell.css">
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </div>
            </div>
            <div class="frames-count">{{gameState.timeFromLastRender}}</div>
            
          </div>
          <div class="control-container">
            <button class="btn" v-on:click="left" v-on:mouseup="rotate">left</button>
            <button class="btn" v-on:click="right">right</button>
            <button class="btn" v-on:click="down">down</button>
            <button class="btn" v-on:click="rotate">rotate</button>
            <button class="btn" v-on:click="togglePause">pause</button>
          </div>
        </div>
        
        `,
  el: '#app',
  data() {
    return {
      gameState: null
    }
  },
  methods: {
    render(gameState) {
      if(gameState.gameStatus == 3)
        alert('game over')
      this.gameState = gameState
    },
    togglePause() {
      this.$gameEngine.togglePause();
    },
    rotate() {
      this.$gameEngine.rotate('Max');
    },
    left() {
      this.$gameEngine.moveLeft('Max');
    },
    right() {
      this.$gameEngine.moveRight('Max');
    },
    down() {
      this.$gameEngine.moveDown('Max');
    },
    onKeyDown(e) {
      if (e && e.key && this) {
        switch (e.key) {
          case 'Insert':
            this.$gameEngine.rotateBack('Max')
            break
          case 'Delete':
            this.$gameEngine.rotate('Max')
            break
          case 'ArrowUp':
            this.$gameEngine.moveUp('Max')
            break
          case 'ArrowDown':
            this.$gameEngine.moveDown('Max')
            break
          case 'ArrowLeft':
            this.$gameEngine.moveLeft('Max')
            break
          case 'ArrowRight':
            this.$gameEngine.moveRight('Max')
            break

          case 'v':
            this.$gameEngine.rotateBack('Oxana')
            break
          case 'b':
            this.$gameEngine.rotate('Oxana')
            break
          case 'w':
            this.$gameEngine.moveUp('Oxana')
            break
          case 's':
            this.$gameEngine.moveDown('Oxana')
            break
          case 'a':
            this.$gameEngine.moveLeft('Oxana')
            break
          case 'd':
            this.$gameEngine.moveRight('Oxana')
            break
        }
      }
    }
  },
  beforeMount() {
    let defaultHeap = [
      [0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
      [1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    ]


    var self = this
    let options = {
      height: 30,
      width: 15,
      defaultHeap: defaultHeap,
      additionalShapes: {},
      renderHandle: self.render, 
      players: [{name:'Oxana', isBot: true},{name:'Oxana2', isBot: true},{name:'Oxana3', isBot: true}],
    }
    
    this.$gameEngine = new Engine(options)

    window.document.body.addEventListener('keydown', this.onKeyDown.bind(this))

    this.$gameEngine.start();
  }
})


// <ol v-if="gameState.statistic" class="statistic-list">
// <li v-for="(value, key) in gameState.statistic.countShapesFalledByType">{{key}}: {{value}}</li>
// </ol>
// <div>Total: {{ gameState.statistic.countShapesFalled }}</div>

// <ul v-if="gameState.statistic" class="statistic-list">
// <li>count lines reduced: {{ gameState.statistic.countLinesReduced }}</li>
// <li>count double lines reduced: {{ gameState.statistic.countDoubleLinesReduced }}</li>
// <li>count triple lines reduced: {{ gameState.statistic.countTrippleLinesReduced }}</li>
// <li>count quadruple lines reduced: {{ gameState.statistic.countQuadrupleLinesReduced }}</li>
// </ul>