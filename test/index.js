
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
            <div v-if="gameState.nextShape">
                <table class="shape-table">
                    <tbody>
                        <tr v-for="row in gameState.nextShape.body">
                            <td v-for="cell in row"
                                v-bind:class="cell.css">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <ol v-if="gameState.statistic" class="statistic-list">
                <li v-for="(value, key) in gameState.statistic.countShapesFalledByType">{{key}}: {{value}}</li>
            </ol>
            <div>Total: {{ gameState.statistic.countShapesFalled }}</div>

            <ul v-if="gameState.statistic" class="statistic-list">
                <li>count lines reduced: {{ gameState.statistic.countLinesReduced }}</li>
                <li>count double lines reduced: {{ gameState.statistic.countDoubleLinesReduced }}</li>
                <li>count triple lines reduced: {{ gameState.statistic.countTrippleLinesReduced }}</li>
                <li>count quadruple lines reduced: {{ gameState.statistic.countQuadrupleLinesReduced }}</li>
            </ul>
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
          this.$gameEngine.rotateBack()
          break
        case 'Delete':
          this.$gameEngine.rotate()
          break
        case 'ArrowUp':
          this.$gameEngine.moveUp()
          break
        case 'ArrowDown':
          this.$gameEngine.moveDown()
          break
        case 'ArrowLeft':
          this.$gameEngine.moveLeft()
          break
        case 'ArrowRight':
          this.$gameEngine.moveRight()
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

    let addittionalShapes = {
      "MyShape": [
        [0,1,0],
        [0,1,0]
      ]
    }

    var self = this
    console.log(self.render);
    let options = {
      height: 30,
      width: 70,
      defaultHeap: defaultHeap,
      addittionalShapes: addittionalShapes,
      renderHandle: self.render,
      players: [
        'Max',
        'Oxana'
      ]
    }
    console.log(options);
    this.$gameEngine = new Engine(options)

    window.document.body.addEventListener('keydown', this.onKeyDown.bind(this))

    window.document.body.addEventListener('keypress', (p1, p2, p3 ) => {
      console.log(p1);
      console.log(p2);
      console.log(p3);
    })

    this.$gameEngine.start()
    setInterval(()=>{
      this.$gameEngine.moveDown()
    }, 1000)
  }
})
