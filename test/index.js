
import { Engine }  from '../dist/index'

import uglyshapes from './ugly-shapes'

let App = new Vue({
    template:
        `
        <div>
            <table class="game-table">
                <tbody>
                    <tr v-for="row in gameState.body">
                        <td v-for="cell in row"
                            v-bind:class="cell.css">
                        </td>                    
                    </tr>
                </tbody>
            </table>
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
            <div v-if="gameState.statistic">

                <ul class="statistic-list" v-for="metric in gameState.statistic.countShapesFalledByType">
                    <li>"{{metric}}"</li>
                </ul>

                <ul class="statistic-list">
                    <li>all shapes: {{ gameState.statistic.countShapesFalled }}</li>
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
            console.log(gameState);
            var gameState = JSON.parse(gameState);
            if(gameState.gameStatus == 3)
                alert('game over');
            this.gameState = gameState;
            console.log(gameState.body);
            console.error(memorySizeOf(gameState.body));
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
        
        this.$gameEngine = new Engine(areaHeight, areaWidth, this.render, defaultHeap, uglyshapes);

        window.document.body.addEventListener('keydown', this.onKeyDown.bind(this));

        this.$gameEngine.start();
        setInterval(()=>{
            this.$gameEngine.moveDown();
        }, 1000)
    }
});


function memorySizeOf(obj) {
    var bytes = 0;

    function sizeOf(obj) {
        if(obj !== null && obj !== undefined) {
            switch(typeof obj) {
            case 'number':
                bytes += 8;
                break;
            case 'string':
                bytes += obj.length * 2;
                break;
            case 'boolean':
                bytes += 4;
                break;
            case 'object':
                var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                if(objClass === 'Object' || objClass === 'Array') {
                    for(var key in obj) {
                        if(!obj.hasOwnProperty(key)) continue;
                        sizeOf(obj[key]);
                    }
                } else bytes += obj.toString().length * 2;
                break;
            }
        }
        return bytes;
    };

    function formatByteSize(bytes) {
        if(bytes < 1024) return bytes + " bytes";
        else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KiB";
        else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MiB";
        else return(bytes / 1073741824).toFixed(3) + " GiB";
    };

    return formatByteSize(sizeOf(obj));
};