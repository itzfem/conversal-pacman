const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Boundary {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
    }
}