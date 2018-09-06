
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
        }
    },
    beforeMount() {
        this.$gameEngine = new GameEngine(20, 30, this.render);

        setInterval(() => {
            this.$gameEngine.moveLeft();
            this.render(this.$gameEngine.body)
            
        }, 1000)
    }
});
