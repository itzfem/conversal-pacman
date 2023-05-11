const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Boundary {
    static width = 40;
    static height = 40;
    constructor({position, image}) {
        this.position = position;
        this.width = 40;
        this.height = 40;
        this.image = image;
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
    }
}

const pacmanImg = new Image(40,40)
pacmanImg.src = "img/conversallogo.png";

class Player {
    static speed = 4;
    constructor({position, velocity, image}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15
        this.image = image;
        this.speed = 4;
        this.hurt = false;
    }

    draw() {
        c.beginPath();
        if (this.hurt) {
            c.drawImage(createImage("img/pacmanHurt.png"), this.position.x - this.radius, this.position.y - this.radius, this.radius * 2, this.radius * 2);
        } else {
            c.drawImage(this.image, this.position.x - this.radius, this.position.y - this.radius, this.radius * 2, this.radius * 2);
        }
        
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


class Ghost {
    static speed = 2;
    constructor({position, velocity, image}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15
        this.image = image;
        this.prevCollisions = [];
        this.speed = 2;
        this.scared = false;
    }

    draw() {
        c.beginPath();
        if (this.scared) {
            c.drawImage(createImage("img/scaredGhost.png"), this.position.x - this.radius, this.position.y - this.radius, this.radius * 2, this.radius * 2);
        } else {
            c.drawImage(this.image, this.position.x - this.radius, this.position.y - this.radius, this.radius * 2, this.radius * 2);
        }
        c.closePath();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Pellet {
    constructor({position}) {
        this.position = position;
        this.radius = 3
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'white';
        c.fill();
        c.closePath();
    }
}

class PowerUp {
    constructor({position}) {
        this.position = position;
        this.radius = 8
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'white';
        c.fill();
        c.closePath();
    }
}

const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', ' ', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', 'p', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
  ]

function createImage(src) {
    const image = new Image();
    image.src = src;
    return image;
}

const ghosts = [
    new Ghost({
        position: {
            x: Boundary.width * 6 + Boundary.width / 2,
            y: Boundary.height + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        image: createImage('img/facebooklogo.png')
    }),
    new Ghost({
        position: {
            x: Boundary.width * 3 + Boundary.width / 2,
            y: Boundary.height * 5 + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        image: createImage('img/instagramlogo.png')
    }),
    new Ghost({
        position: {
            x: Boundary.width + Boundary.width / 2,
            y: Boundary.height * 9 + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        image: createImage('img/linkedinlogo.png')
    }),
];


const powerUps = [];
const pellets = [];
const boundaries = [];
const player = new Player({
    position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2
    },
    velocity: {
        x: 0, 
        y: 0
    },
    image: createImage("img/pacman/conversallogo.png"),
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
let score = 0;

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case '-':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/Assets/pipeHorizontal.png')
                    })
                )
            break;
            case '|':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/Assets/pipeVertical.png')
                    })
                )
            break;
            case '1':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/Assets/pipeCorner1.png')
                    })
                )
            break;
            case '2':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/Assets/pipeCorner2.png')
                    })
                )
            break;
            case '3':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/Assets/pipeCorner3.png')
                    })
                )
            break;
            case '4':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/Assets/pipeCorner4.png')
                    })
                )
            break;
            case 'b':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/Assets/block.png')
                    })
                )
            break;
            case '[':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/Assets/capLeft.png')
                    })
                )
            break;
            case ']':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/Assets/capRight.png')
                    })
                )
            break;
            case '_':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/Assets/capBottom.png')
                    })
                )
            break;
            case '^':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/Assets/capTop.png')
                    })
                )
            break;
            case '+':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/Assets/pipeCross.png')
                    })
                )
            break;
            case '5':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/Assets/pipeConnectorTop.png')
                    })
                )
            break;
            case '6':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/Assets/pipeConnectorRight.png')
                    })
                )
            break;
            case '7':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/Assets/pipeConnectorBottom.png')
                    })
                )
            break;
            case '8':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/Assets/pipeConnectorLeft.png')
                    })
                )
            break;
            case '.':
                pellets.push(
                    new Pellet({
                        position: {
                            x: Boundary.width * j + Boundary.width / 2,
                            y: Boundary.height * i + Boundary.height / 2
                        }
                    })
                )
            break;
            case 'p':
                powerUps.push(
                    new PowerUp({
                        position: {
                            x: Boundary.width * j + Boundary.width / 2,
                            y: Boundary.height * i + Boundary.height / 2
                        }
                    })
                )
            break;
        }
    })
})

function circleCollidesWithRectangle({
    circle,
    rectangle
}) {
    const padding = Boundary.width / 2 - circle.radius - 1;
    return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding &&
        circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding &&
        circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding &&
        circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding)
}

let animationId;
let lives = 3;

function animate() {
    animationId = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    boundaries.forEach((boundary) => {
        boundary.draw();

        if (circleCollidesWithRectangle({
            circle: player, 
            rectangle: boundary
        })) {
            player.velocity.x = 0;
            player.velocity.y = 0;
        }
    })
    
    player.update();

    if (keys.ArrowUp.pressed && lastKey === 'ArrowUp') {
        for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        if (circleCollidesWithRectangle({
            circle: {...player, velocity: {
                x: 0,
                y: -player.speed
            }}, 
            rectangle: boundary
        })) {
            player.velocity.y = 0;
            player.image = createImage("img/pacman/conversallogo-up.png")
            break
        } else {
            player.velocity.y = -player.speed;
            player.image = createImage("img/pacman/conversallogo-up.png")
        }
    }
    } else if (keys.ArrowLeft.pressed && lastKey === 'ArrowLeft') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circleCollidesWithRectangle({
                circle: {...player, velocity: {
                    x: -player.speed,
                    y: 0
                }}, 
                rectangle: boundary
            })) {
                player.velocity.x = 0;
                player.image = createImage("img/pacman/conversallogo-left.png")
                break
            } else {
                player.velocity.x = -player.speed;
                player.image = createImage("img/pacman/conversallogo-left.png")
            }
        }
    } else if (keys.ArrowDown.pressed && lastKey === 'ArrowDown') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circleCollidesWithRectangle({
                circle: {...player, velocity: {
                    x: 0,
                    y: player.speed
                }}, 
                rectangle: boundary
            })) {
                player.velocity.y = 0;
                player.image = createImage("img/pacman/conversallogo-down.png")
                break
            } else {
                player.velocity.y = player.speed;
                player.image = createImage("img/pacman/conversallogo-down.png")
            }
        }
    } else if (keys.ArrowRight.pressed && lastKey === 'ArrowRight') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (circleCollidesWithRectangle({
                circle: {...player, velocity: {
                    x: player.speed,
                    y: 0
                }}, 
                rectangle: boundary
            })) {
                player.velocity.x = 0;
                player.image = createImage("img/pacman/conversallogo.png")
                break
            } else {
                player.velocity.x = player.speed;
                player.image = createImage("img/pacman/conversallogo.png")
            }
        }
    }

    //detect collision between ghosts and player 
    for (let i = ghosts.length - 1; 0 <= i; i--) {
        const ghost = ghosts[i];

        if (
            Math.hypot(
                ghost.position.x - player.position.x,
                ghost.position.y - player.position.y
            ) <
            ghost.radius + player.radius
        ) {
            if (ghost.scared) {
                ghosts.splice(i, 1)
            } 
        }
    }

    //win condition
    if (pellets.length === 0) {
        console.log("you win!");
        cancelAnimationFrame(animationId)
    }

    //powerups
    for (let i = powerUps.length - 1; 0 <= i; i--) {
        const powerUp = powerUps[i];
        powerUp.draw();

        if (
            Math.hypot(
                powerUp.position.x - player.position.x,
                powerUp.position.y - player.position.y
            ) < 
            powerUp.radius + player.radius
        ) {
            powerUps.splice(i, 1)

            ghosts.forEach(ghost => {
                ghost.scared = true;

                setTimeout(() => {
                    ghost.scared = false;
                }, 3000)
            })
        }
    }

    //pellets are touched
    for (let i = pellets.length - 1; 0 <= i; i--) {
        const pellet = pellets[i];
        pellet.draw();

        if (Math.hypot(pellet.position.x - player.position.x, pellet.position.y - player.position.y) <
        pellet.radius + player.radius) {
            pellets.splice(i, 1)
            score += 10;
            scoreElement.innerHTML = score;
        }
    }

    function togglePlayerHurt() {
        player.hurt = !player.hurt;
    }

    ghosts.forEach(ghost => {
        ghost.update();

        //ghost touches player
        if (Math.hypot(ghost.position.x - player.position.x,
            ghost.position.y - player.position.y) <
            ghost.radius + player.radius && !ghost.scared) {
                if (!ghost.collided) {
                    const hurtInterval = setInterval(togglePlayerHurt, 100);
                    setTimeout(() => {
                        clearInterval(hurtInterval);
                        togglePlayerHurt();
                    }, 1500);
                    lives--;
                    livesElement.innerHTML = lives;
                    ghost.collided = true;
                    if (lives === 0) {
                        cancelAnimationFrame(animationId);
                        //c.reset();
                    }
                }
        } else {
            ghost.collided = false;
        }

        const collisions = [];

        boundaries.forEach(boundary => {
            if (!collisions.includes('right') && circleCollidesWithRectangle({
                circle: {...ghost, velocity: {
                    x: ghost.speed,
                    y: 0
                }}, 
                rectangle: boundary
            })
            ) {
                collisions.push('right');
            }

            if (!collisions.includes('left') && circleCollidesWithRectangle({
                circle: {...ghost, velocity: {
                    x: -ghost.speed,
                    y: 0
                }}, 
                rectangle: boundary
            })
            ) {
                collisions.push('left');
            }

            if (!collisions.includes('up') && circleCollidesWithRectangle({
                circle: {...ghost, velocity: {
                    x: 0,
                    y: -ghost.speed
                }}, 
                rectangle: boundary
            })
            ) {
                collisions.push('up');
            }

            if (!collisions.includes('down') && circleCollidesWithRectangle({
                circle: {...ghost, velocity: {
                    x: 0,
                    y: ghost.speed
                }}, 
                rectangle: boundary
            })
            ) {
                collisions.push('down');
            }
        })
        if (collisions.length > ghost.prevCollisions.length)
            ghost.prevCollisions = collisions

        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {

            if (ghost.velocity.x > 0) ghost.prevCollisions.push('right')
            else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left')
            else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up')
            else if (ghost.velocity.y > 0) ghost.prevCollisions.push('down')

            const pathways = ghost.prevCollisions.filter(collision => {
                return !collisions.includes(collision);
            })

            const direction = pathways[Math.floor(Math.random() * pathways.length)]

            switch(direction) {
                case 'down':
                    ghost.velocity.y = ghost.speed
                    ghost.velocity.x = 0
                    break;
                case 'up':
                    ghost.velocity.y = -ghost.speed
                    ghost.velocity.x = 0
                    break;
                case 'right':
                    ghost.velocity.y = 0
                    ghost.velocity.x = ghost.speed
                    break;
                case 'left':
                    ghost.velocity.y = 0
                    ghost.velocity.x = -ghost.speed
                    break;
            }

            ghost.prevCollisions = [];
        }
    })
}


animate();

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

