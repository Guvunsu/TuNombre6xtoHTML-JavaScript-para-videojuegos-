const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');

const blockWidth = 100;
const blockHeight = 20;
const ballDiameter = 20;

const boardWidth = 560;
const boardHeight = 300;

let xDirection = -2;
let yDirection = 2;

let score = 0;
let timerId;

let player;
let ball;

const playerStart = [230, 10];
let currentPosition = [...playerStart];

const ballStart = [270, 40];
let ballCurrentPosition = [...ballStart];

class Block {
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis];
        this.bottomRight = [xAxis + blockWidth, yAxis];
        this.topLeft = [xAxis, yAxis + blockHeight];
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
    }
}

const blocks = [
    new Block(10, 270), new Block(120, 270), new Block(230, 270), new Block(340, 270), new Block(450, 270),
    new Block(10, 240), new Block(120, 240), new Block(230, 240), new Block(340, 240), new Block(450, 240),
    new Block(10, 210), new Block(120, 210), new Block(230, 210), new Block(340, 210), new Block(450, 210)
];

// DRAW
function addBlock() {
    blocks.forEach(blockData => {
        const block = document.createElement('div');
        block.classList.add('block');
        block.style.left = blockData.bottomLeft[0] + 'px';
        block.style.bottom = blockData.bottomLeft[1] + 'px';
        grid.appendChild(block);
    });

    // player
    player = document.createElement('div');
    player.classList.add('player');
    grid.appendChild(player);

    // ball
    ball = document.createElement('div');
    ball.classList.add('ball');
    grid.appendChild(ball);

    drawUser();
    drawBall();
}

function drawUser() {
    player.style.left = currentPosition[0] + 'px';
    player.style.bottom = currentPosition[1] + 'px';
}

function drawBall() {
    ball.style.left = ballCurrentPosition[0] + 'px';
    ball.style.bottom = ballCurrentPosition[1] + 'px';
}

// PLAYER
function moveUser(e) {
    switch (e.key) {
        case 'ArrowLeft':
            if (currentPosition[0] > 0) {
                currentPosition[0] -= 10;
                drawUser();
            }
            break;

        case 'ArrowRight':
            if (currentPosition[0] < (boardWidth - blockWidth)) {
                currentPosition[0] += 10;
                drawUser();
            }
            break;
    }
}
document.addEventListener('keydown', moveUser);

// BALL
function moveBall() {
    ballCurrentPosition[0] += xDirection;
    ballCurrentPosition[1] += yDirection;
    drawBall();
    checkForCollisions();
}

// COLLISIONS
function checkForCollisions() {
    const allBlocks = document.querySelectorAll('.block');

    // bloques
    for (let i = 0; i < blocks.length; i++) {
        if (
            ballCurrentPosition[0] > blocks[i].bottomLeft[0] &&
            ballCurrentPosition[0] < blocks[i].bottomRight[0] &&
            (ballCurrentPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] &&
            ballCurrentPosition[1] < blocks[i].topLeft[1]
        ) {
            allBlocks[i].classList.remove('block');
            blocks.splice(i, 1);

            changeDirection();

            score++;
            scoreDisplay.innerHTML = score;

            if (blocks.length === 0) {
                scoreDisplay.innerHTML = 'YOU WIN!';
                clearInterval(timerId);
            }
        }
    }

    // paredes
    if (
        ballCurrentPosition[0] >= (boardWidth - ballDiameter) ||
        ballCurrentPosition[0] <= 0 ||
        ballCurrentPosition[1] >= (boardHeight - ballDiameter)
    ) {
        changeDirection();
    }

    // player
    if (
        ballCurrentPosition[0] > currentPosition[0] &&
        ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
        ballCurrentPosition[1] > currentPosition[1] &&
        ballCurrentPosition[1] < currentPosition[1] + blockHeight
    ) {
        changeDirection();
    }

    // game over
    if (ballCurrentPosition[1] <= 0) {
        clearInterval(timerId);
        scoreDisplay.innerHTML = 'GAME OVER';
    }
}

function changeDirection() {
    if (xDirection === 2 && yDirection === 2) yDirection = -2;
    else if (xDirection === 2 && yDirection === -2) xDirection = -2;
    else if (xDirection === -2 && yDirection === -2) yDirection = 2;
    else if (xDirection === -2 && yDirection === 2) xDirection = 2;
}

// INIT
addBlock();
timerId = setInterval(moveBall, 30);