let shapeSet = require('../dist/shapes/tetra-shapes');
let Shape = require('../dist/shape').Shape;

let shape = new Shape(shapeSet);

console.log(shape);
shape.rotate();

console.log(shape);
shape.rotateBack();


let App = new Vue({
    template:
        `<table class="figure-show-table">
            <tbody>
                <tr v-for="row in shape.body">
                    <td v-for="cell in row"
                        v-bind:class="{ figure: cell == 1, empty: cell.val == 0 }">
                    </td>
                </tr>
            </tbody>
        </table>`,
    el: '#app',
    data() {
        
        return {
            shape: new Shape(shapeSet)
        }
    },
    methods: {
        render() {
            this.shape =  new Shape(shapeSet);
        }
    },
    beforeMount() {
        setInterval(()=>{
            this.render()
        }, 1000)
    }
});
