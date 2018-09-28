
let Engine = tetrisEngine.Engine

let App = new Vue({
  template:
        `
        <div class="test-container">
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
            <div v-if="gameState.playData.nextShape">
                <table class="shape-table">
                    <tbody>
                        <tr v-for="row in gameState.playData.nextShape.body">
                            <td v-for="cell in row"
                                v-bind:class="cell.css">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

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

    let areaHeight = 50
    let areaWidth = 80

    let defaultHeap = [
      [0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
      [1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    ]

    let additionalShapes = {
      "MyShape": [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
      ],
      "MyShape2": [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 1, 1, 1],
        [0, 0, 0, 1, 0],
        [1, 0, 0, 0, 0],
      ]
    }

    var self = this
    let options = {
      height: 30,
      width: 15,
      defaultHeap: defaultHeap,
      additionalShapes: additionalShapes,
      renderHandle: self.render,
      players: [
        'Max',
        'Oxana',
      ]
    }
    
    this.$gameEngine = new Engine(options)

    window.document.body.addEventListener('keydown', this.onKeyDown.bind(this))

    this.$gameEngine.start()
    setInterval(() => {
      this.$gameEngine.moveDownAll()
    }, 1000)
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