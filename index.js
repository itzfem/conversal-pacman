const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Boundary {
    static width = 40;
    static height = 40;
    constructor({position}) {
        this.position = position;
        this.width = 40;
        this.height = 40;
    }

    draw() {
        c.fillStyle = 'blue';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const pacmanImg = new Image(40,40)
pacmanImg.src = "img/conversallogo.png";

class Player {
    constructor({position, velocity, image}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15
        this.image = image;
    }

    draw() {
        c.beginPath();
        c.drawImage(this.image, this.position.x - this.radius, this.position.y - this.radius, this.radius * 2, this.radius * 2);
        //c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        //c.fillStyle = 'yellow';
        //c.fill();
        c.closePath();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

const map = [
    ['-', '-', '-', '-', '-', '-'],
    ['-', ' ', ' ', ' ', ' ', '-'],
    ['-', ' ', '-', '-', ' ', '-'],
    ['-', ' ', ' ', ' ', ' ', '-'],
    ['-', '-', '-', '-', '-', '-'],
]
const boundaries = []
const player = new Player({
    position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2
    },
    velocity: {
        x: 0, 
        y: 0
    },
    image: pacmanImg,
})

const keys = {
    ArrowUp: {
        pressed: false
    },
    ArrowDown: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}

let lastKey = '';

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case '-':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        }
                    })
                )
            break;
        }
    })
})

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    boundaries.forEach((boundary) => {
        boundary.draw();
    })
    player.update();
    player.velocity.x = 0
    player.velocity.y = 0

    if(keys.ArrowUp.pressed && lastKey === 'ArrowUp') {
        player.velocity.y = -5
    } else if (keys.ArrowLeft.pressed && lastKey === 'ArrowLeft') {
        player.velocity.x = -5
    } else if (keys.ArrowDown.pressed && lastKey === 'ArrowDown') {
        player.velocity.y = 5
    } else if (keys.ArrowRight.pressed && lastKey === 'ArrowRight') {
        player.velocity.x = 5
    }
}

pacmanImg.onload = () => {
    animate();
}

addEventListener('keydown', function(event) {
    event.preventDefault();
    switch(event.key) {
            case 'ArrowUp':
                keys.ArrowUp.pressed = true;
                lastKey = 'ArrowUp';
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                lastKey = 'ArrowLeft';
                break;
            case 'ArrowDown':
                keys.ArrowDown.pressed = true;
                lastKey = 'ArrowDown';
                break;
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                lastKey = 'ArrowRight';
                break;
        }
})

addEventListener('keyup', function(event) {
    event.preventDefault();
    switch(event.key) {
            case 'ArrowUp':
                keys.ArrowUp.pressed = false;
                break;
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = false;
                break;
            case 'ArrowDown':
                keys.ArrowDown.pressed = false;
                break;
            case 'ArrowRight':
                keys.ArrowRight.pressed = false;
                break;
        }
})

