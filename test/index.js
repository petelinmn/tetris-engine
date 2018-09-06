
import { Engine as GameEngine } from '../dist/index'

let App = new Vue({
    template:
        `<table class="game-table">
            <tbody>
                <tr v-for="row in gameBody">
                    <td v-for="cell in row"
                        v-bind:class="{ figure: cell.val == 1, empty: cell.val == 0 }">
                    </td>
                </tr>
            </tbody>
        </table>`,
    el: '#app',
    data() {       
        return {
            gameBody: null
        }
    },
    methods: {
        render(gameBody) {
            this.gameBody = gameBody;
        },
        onKeyDown(e) {
            if (e && e.key && this) {
               switch (e.key) {
                  case 'Insert':
                    this.$gameEngine.rotateBack();
                    break;
                  case 'Delete':
                    this.$gameEngine.rotate();
                    break;
                  case 'ArrowUp':
                    this.$gameEngine.moveUp();
                    break;
                  case 'ArrowDown':
                    this.$gameEngine.moveDown();
                    break;
                  case 'ArrowLeft':
                    this.$gameEngine.moveLeft();
                    break;
                  case 'ArrowRight':
                    this.$gameEngine.moveRight();
                    break;
                }
            }
        }
    },
    beforeMount() {
        this.$gameEngine = new GameEngine(20, 30, this.render);

        setInterval(() => {    
            this.render(this.$gameEngine.body)
            
        }, 1000);

        window.document.body.addEventListener('keydown', this.onKeyDown.bind(this));
    }
});
