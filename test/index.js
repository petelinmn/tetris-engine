
import { Engine as GameEngine } from '../dist/index'

import uglyshapes from './ugly-shapes'

let App = new Vue({
    template:
        `<table class="game-table">
            <tbody>
                <tr v-for="row in gameState.body">
                    <td v-for="cell in row"
                        v-bind:class="cell.cssClasses">
                    </td>                    
                </tr>
            </tbody>
        </table>`,
    el: '#app',
    data() {       
        return {
            gameState: null
        }
    },
    methods: {
        render(gameState) {
            if(gameState.gameStatus == 3)
                alert('game over');
            this.gameState = gameState;
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

        let areaHeight = 15;
        let areaWidth = 25;

        let defaultHeap = [
          [0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];
        
        this.$gameEngine = new GameEngine(areaHeight, areaWidth, this.render, defaultHeap, uglyshapes);

        window.document.body.addEventListener('keydown', this.onKeyDown.bind(this));

        this.$gameEngine.start();
        setInterval(()=>{
            this.$gameEngine.moveDown();
        }, 1000)
    }
});
