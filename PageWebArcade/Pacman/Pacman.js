const canvas = document.querySelector('canvas');
const scoreElement = document.querySelector('#scoreElement');
const c = canvas.getContext('2d');
const livesElement = document.querySelector('#livesElement');
const restartBtn = document.getElementById("restartBtn");
//hacer la clase de reinicio
canvas.width = innerWidth;
canvas.height = innerHeight;

class Boundary {
    static width = 50;
    static height = 50;

    constructor({ position, image }) {
        this.position = position;
        this.width = 50;
        this.height = 50;
        this.image = image;
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
    }
}
class Pellet {
    constructor({ position }) {
        this.position = position;
        this.radius = 5;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'white';
        c.fill();
        c.closePath();
    }
}
class PowerUp {
    constructor({ position }) {
        this.position = position;
        this.radius = 9;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'white';
        c.fill();
        c.closePath();
    }
}
class Player {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.radians = 0.75;
        this.openRate = 0.12;
        this.rotation = 0;
    }

    draw() {
        c.save();
        c.translate(this.position.x, this.position.y);
        c.rotate(this.rotation);
        c.translate(-this.position.x, -this.position.y);
        c.beginPath();
        c.arc(this.position.x, this.position.y,
            this.radius, this.radians, Math.PI * 2 - this.radians);
        c.lineTo(this.position.x, this.position.y);
        c.fillStyle = 'yellow';
        c.fill();
        c.closePath();
        c.restore();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.radians += this.openRate;
        if (this.radians < 0 || this.radians > 0.75) {
            this.openRate = -this.openRate;
        }
    }
}
class Ghost {
    static speed = 2;
    constructor({ position, velocity, color = 'red' }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.color = color;
        this.prevCollisions = [];
        this.speed = 2;
        this.scared = false;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.scared ? 'blue' : this.color;
        c.fill();
        c.closePath();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

function createImage(src) {
    const image = new Image();
    image.src = src;
    return image;
}

let lastKey = '';
let score = 0;
let lives = 3;
let gameOver = false;
let gameWon = false;
livesElement.innerText = lives;
//mapa del juego, cada símbolo representa un elemento diferente
const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', 'p', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', 'p', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', 'p', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
];

const pellets = [];
const boundaries = [];
const powerUps = [];

const ghosts = [new Ghost({
    position: {
        x: Boundary.width * 8 + Boundary.width / 2,
        y: Boundary.height * 5 + Boundary.height / 2
    },
    velocity: { x: Ghost.speed, y: 0 }
}),
new Ghost({
    position: {
        x: Boundary.width * 8 + Boundary.width / 2,
        y: Boundary.height * 5 + Boundary.height / 2
    },
    velocity: { x: Ghost.speed, y: 0 },
    color: 'pink'
})];

const playerSpawnPosition = {
    x: Boundary.width * 3 + Boundary.width / 2,
    y: Boundary.height * 3 + Boundary.height / 2
};

const player = new Player({
    position: {
        //x: Boundary.width * 3 + Boundary.width / 2,
        //y: Boundary.height * 3 + Boundary.height / 2
        x: playerSpawnPosition.x,
        y: playerSpawnPosition.y
    },
    velocity: { x: 0, y: 0 }
});
//dibujado del mapa
map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case '-':
                boundaries.push(new Boundary({
                    position: { x: Boundary.width * j, y: Boundary.height * i },
                    image: createImage('./img/pipeHorizontal.png')
                }));
                break;
            case '|':
                boundaries.push(new Boundary({
                    position: { x: Boundary.width * j, y: Boundary.height * i },
                    image: createImage('./img/pipeVertical.png')
                }));
                break;
            case '1':
                boundaries.push(new Boundary({
                    position: { x: Boundary.width * j, y: Boundary.height * i },
                    image: createImage('./img/pipeCorner1.png')
                }));
                break;
            case '2':
                boundaries.push(new Boundary({
                    position: { x: Boundary.width * j, y: Boundary.height * i },
                    image: createImage('./img/pipeCorner2.png')
                }));
                break;
            case '3':
                boundaries.push(new Boundary({
                    position: { x: Boundary.width * j, y: Boundary.height * i },
                    image: createImage('./img/pipeCorner3.png')
                }));
                break;
            case '4':
                boundaries.push(new Boundary({
                    position: { x: Boundary.width * j, y: Boundary.height * i },
                    image: createImage('./img/pipeCorner4.png')
                }));
                break;
            case 'b':
                boundaries.push(new Boundary({
                    position: { x: Boundary.width * j, y: Boundary.height * i },
                    image: createImage('./img/block.png')
                }));
                break;
            case '[':
                boundaries.push(new Boundary({
                    position: { x: j * Boundary.width, y: i * Boundary.height },
                    image: createImage('./img/capLeft.png')
                }));
                break;
            case ']':
                boundaries.push(new Boundary({
                    position: { x: j * Boundary.width, y: i * Boundary.height },
                    image: createImage('./img/capRight.png')
                }));
                break;
            case '_':
                boundaries.push(new Boundary({
                    position: { x: j * Boundary.width, y: i * Boundary.height },
                    image: createImage('./img/capBottom.png')
                }));
                break;
            case '^':
                boundaries.push(new Boundary({
                    position: { x: j * Boundary.width, y: i * Boundary.height },
                    image: createImage('./img/capTop.png')
                }));
                break;
            case '+':
                boundaries.push(new Boundary({
                    position: { x: j * Boundary.width, y: i * Boundary.height },
                    image: createImage('./img/pipeCross.png')
                }));
                break;
            case '5':
                boundaries.push(new Boundary({
                    position: { x: j * Boundary.width, y: i * Boundary.height },
                    image: createImage('./img/pipeConnectorTop.png')
                }));
                break;
            case '6':
                boundaries.push(new Boundary({
                    position: { x: j * Boundary.width, y: i * Boundary.height },
                    image: createImage('./img/pipeConnectorRight.png')
                }));
                break;
            case '7':
                boundaries.push(new Boundary({
                    position: { x: j * Boundary.width, y: i * Boundary.height },
                    image: createImage('./img/pipeConnectorBottom.png')
                }));
                break;
            case '8':
                boundaries.push(new Boundary({
                    position: { x: j * Boundary.width, y: i * Boundary.height },
                    image: createImage('./img/pipeConnectorLeft.png')
                }));
                break;
            case '.':
                pellets.push(new Pellet({
                    position: {
                        x: j * Boundary.width + Boundary.width / 2,
                        y: i * Boundary.height + Boundary.height / 2
                    }
                }));
                break;
            case 'p':
                powerUps.push(new PowerUp({
                    position: {
                        x: j * Boundary.width + Boundary.width / 2,
                        y: i * Boundary.height + Boundary.height / 2
                    }
                }));
                break;
        }
    });
});

const keys = { w: { pressed: false }, a: { pressed: false }, s: { pressed: false }, d: { pressed: false } };

function circleCollidesWithRectangle({ circle, rectangle, velocity }) {
    const padding = Boundary.width / 2 - circle.radius - 1;
    return (
        circle.position.y - circle.radius + velocity.y < rectangle.position.y + rectangle.height + padding &&
        circle.position.x + circle.radius + velocity.x > rectangle.position.x - padding &&
        circle.position.y + circle.radius + velocity.y > rectangle.position.y - padding &&
        circle.position.x - circle.radius + velocity.x < rectangle.position.x + rectangle.width + padding
    );
}

let animationId;
let wakaSound = new Audio("Pac-Man Waka Waka Seamless Loop.mp3");
let powerMusic = new Audio("Pac-Man Power Up.mp3");
let gameOverSound = new Audio("GTA V WastedBusted - Sound Effect (HD).mp3");
let winSound = new Audio("GTA San Andreas - Mission passed sound.mp3");
// volumen
wakaSound.volume = 0.3;
powerMusic.volume = 0.5;
gameOverSound.volume = 1;
winSound.volume = 1;

// loop infinito
wakaSound.loop = false;
powerMusic.loop = true;

// desbloquear audio del navegador
document.addEventListener("keydown", () => {

    wakaSound.play();
    wakaSound.pause();
    wakaSound.currentTime = 0;

    powerMusic.play();
    powerMusic.pause();
    powerMusic.currentTime = 0;

}, { once: true });

// estado power up
let powerMode = false;
let powerTimer;

function animate() {
    animationId = requestAnimationFrame(animate);
    console.log(animationId);
    // requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    boundaries.forEach(boundary => boundary.draw());

    // TOUCH PELLET HERE TO INCREASE SCORE
    for (let i = pellets.length - 1; i >= 0; i--) {
        const pellet = pellets[i];
        pellet.draw();

        if (Math.hypot(pellet.position.x - player.position.x,
            pellet.position.y - player.position.y) <
            pellet.radius + player.radius) {
            pellets.splice(i, 1);
            score += 10;
            scoreElement.innerText = score;
        }
    }

    //powerups go
    //powerups go
    for (let i = powerUps.length - 1; i >= 0; i--) {

        const powerUp = powerUps[i];
        powerUp.draw();

        // collision con powerup
        if (
            Math.hypot(
                powerUp.position.x - player.position.x,
                powerUp.position.y - player.position.y
            ) < powerUp.radius + player.radius
        ) {

            powerUps.splice(i, 1);

            // fantasmas scared
            ghosts.forEach(ghost => ghost.scared = true);

            // Cambiar musica sfx

            powerMode = true;

            wakaSound.pause();
            wakaSound.currentTime = 0;

            powerMusic.currentTime = 0;
            powerMusic.play();

            clearTimeout(powerTimer);

            powerTimer = setTimeout(() => {

                ghosts.forEach(ghost => ghost.scared = false);

                powerMode = false;

                powerMusic.pause();
                powerMusic.currentTime = 0;

                wakaSound.play();

            }, 6660);
        }
    }

    //animación de la boca de pacman
    if (player.velocity.x > 0) player.rotation = 0;
    else if (player.velocity.x < 0) player.rotation = Math.PI;
    else if (player.velocity.y > 0) player.rotation = Math.PI / 2;
    else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5;

    // sonido movimiento
    if (
        (keys.w.pressed ||
            keys.a.pressed ||
            keys.s.pressed ||
            keys.d.pressed)
        &&
        !powerMode
    ) {

        if (wakaSound.paused) {
            wakaSound.play();
        }

    } else {

        if (!powerMode) {
            wakaSound.pause();
        }
    }
    //player 
    player.update();
    player.velocity.x = 0;
    player.velocity.y = 0;

    //ghost movements and collisions
    ghosts.forEach(ghost => {
        ghost.update();

        /* //Colisión jugador-fantasma
        if (Math.hypot(ghost.position.x - player.position.x,
            ghost.position.y - player.position.y) <
            ghost.radius + player.radius) {

            if (ghost.scared) {
                // Si está asustado
                const index = ghosts.indexOf(ghost);
                ghosts.splice(index, 1);
                score += 100;
                scoreElement.innerText = score;
            } else {
                // Si no está asustado
                cancelAnimationFrame(animationId);
                wakaSound.pause();
                powerMusic.pause();
                gameOverSound.currentTime = 0;
                gameOverSound.play();
                c.font = "80px Arial";
                c.fillStyle = "yellow";
                c.fillText("WASTED", canvas.width / 2 - 180, canvas.height / 2);
                console.log('Game Over');
            }
        }*/
        //Colisión jugador-fantasma
        if (
            Math.hypot(
                ghost.position.x - player.position.x,
                ghost.position.y - player.position.y
            ) < ghost.radius + player.radius
        ) {

            if (ghost.scared) {

                // matar fantasma
                const index = ghosts.indexOf(ghost);

                ghosts.splice(index, 1);

                score += 100;
                scoreElement.innerText = score;

            } else if (!gameOver) {

                // perder vida
                lives--;

                livesElement.innerText = lives;

                // sonidos
                wakaSound.pause();
                powerMusic.pause();

                gameOverSound.currentTime = 0;
                gameOverSound.play();

                // respawn jugador
                player.position.x = playerSpawnPosition.x;
                player.position.y = playerSpawnPosition.y;

                player.velocity.x = 0;
                player.velocity.y = 0;

                // resetear fantasmas
                ghosts.forEach((ghost, index) => {

                    ghost.position.x = Boundary.width * 8 + Boundary.width / 2;
                    ghost.position.y = Boundary.height * 5 + Boundary.height / 2;

                    ghost.velocity.x = Ghost.speed;
                    ghost.velocity.y = 0;

                    ghost.scared = false;
                });

                // si vidas llegan a 0
                if (lives <= 0) {

                    gameOver = true;

                    cancelAnimationFrame(animationId);

                    wakaSound.pause();
                    powerMusic.pause();

                    gameOverSound.currentTime = 0;
                    gameOverSound.play();

                    c.font = "80px Arial";
                    c.fillStyle = "red";
                    c.fillText(
                        "WASTED",
                        canvas.width / 2 - 180,
                        canvas.height / 2
                    );

                    console.log("GAME OVER");
                }
            }
        }

        //Win condition(estaba)

        // ✅ Colisiones con muros
        const collisions = [];
        boundaries.forEach(boundary => {
            if (circleCollidesWithRectangle({ circle: ghost, rectangle: boundary, velocity: { x: ghost.speed, y: 0 } })) {
                collisions.push('right');
            }
            if (circleCollidesWithRectangle({ circle: ghost, rectangle: boundary, velocity: { x: -ghost.speed, y: 0 } })) {
                collisions.push('left');
            }
            if (circleCollidesWithRectangle({ circle: ghost, rectangle: boundary, velocity: { x: 0, y: ghost.speed } })) {
                collisions.push('down');
            }
            if (circleCollidesWithRectangle({ circle: ghost, rectangle: boundary, velocity: { x: 0, y: -ghost.speed } })) {
                collisions.push('up');
            }
        });

        if (collisions.length > ghost.prevCollisions.length) {
            ghost.prevCollisions = collisions;
        }

        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
            if (ghost.velocity.x > 0) ghost.prevCollisions.push('right');
            else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left');
            else if (ghost.velocity.y > 0) ghost.prevCollisions.push('down');
            else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up');

            const pathways = ghost.prevCollisions.filter(c => !collisions.includes(c));
            const direction = pathways[Math.floor(Math.random() * pathways.length)];

            switch (direction) {
                case 'down':
                    ghost.velocity.x = 0;
                    ghost.velocity.y = ghost.speed;
                    break;
                case 'up':
                    ghost.velocity.x = 0;
                    ghost.velocity.y = -ghost.speed;
                    break;
                case 'left':
                    ghost.velocity.x = -ghost.speed;
                    ghost.velocity.y = 0;
                    break;
                case 'right':
                    ghost.velocity.x = ghost.speed;
                    ghost.velocity.y = 0;
                    break;
            }
            ghost.prevCollisions = [];
        }
    });
   // WIN CONDITION
if (pellets.length === 0 && powerUps.length === 0 && !gameWon) {

    gameWon = true;

    cancelAnimationFrame(animationId);

    wakaSound.pause();
    powerMusic.pause();

    // reproducir audio win
    winSound.currentTime = 0;
    winSound.play();

    // fondo oscuro
    c.fillStyle = "rgba(0, 0, 0, 0.8)";
    c.fillRect(0, 0, canvas.width, canvas.height);

    // texto win
    c.font = "80px Arial";
    c.fillStyle = "yellow";
    c.textAlign = "center";

    c.fillText(
        "Gya Gya Gya Mission Complete",
        canvas.width / 2,
        canvas.height / 2
    );

    // score
    c.font = "35px Arial";
    c.fillStyle = "white";

    c.fillText(
        `SCORE: ${score}`,
        canvas.width / 2,
        canvas.height / 2 + 60
    );

    console.log("YOU WIN");
}

    if (keys.w.pressed && lastKey === 'w') {
        let moving = true;
        for (const boundary of boundaries) {
            if (circleCollidesWithRectangle({ circle: player, rectangle: boundary, velocity: { x: 0, y: -5 } })) {
                moving = false;
                break;
            }
        }
        if (moving) player.velocity.y = -5;
    } else if (keys.a.pressed && lastKey === 'a') {
        let moving = true;
        for (const boundary of boundaries) {
            if (circleCollidesWithRectangle({ circle: player, rectangle: boundary, velocity: { x: -5, y: 0 } })) {
                moving = false;
                break;
            }
        }
        if (moving) player.velocity.x = -5;
    } else if (keys.s.pressed && lastKey === 's') {
        let moving = true;
        for (const boundary of boundaries) {
            if (circleCollidesWithRectangle({ circle: player, rectangle: boundary, velocity: { x: 0, y: 5 } })) {
                moving = false;
                break;
            }
        }
        if (moving) player.velocity.y = 5;
    } else if (keys.d.pressed && lastKey === 'd') {
        let moving = true;
        for (const boundary of boundaries) {
            if (circleCollidesWithRectangle({ circle: player, rectangle: boundary, velocity: { x: 5, y: 0 } })) {
                moving = false;
                break;
            }
        }
        if (moving) player.velocity.x = 5;
    }
}

animate();
addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = true;
            lastKey = 'w';
            break;
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a';
            break;
        case 's':
            keys.s.pressed = true;
            lastKey = 's';
            break;
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
            break;
    }
});

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
});
restartBtn.addEventListener("click", () => {

    // detener audios
    wakaSound.pause();
    powerMusic.pause();
    gameOverSound.pause();
    winSound.pause();

    // reiniciar tiempo de audios
    wakaSound.currentTime = 0;
    powerMusic.currentTime = 0;
    gameOverSound.currentTime = 0;
    winSound.currentTime = 0;

    // recargar juego completo
    location.reload();

});