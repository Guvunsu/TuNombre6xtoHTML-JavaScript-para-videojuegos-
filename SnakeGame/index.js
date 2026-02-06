// variables visuales del j
const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.GetContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "whitw";
const snakeCaolor = "lightgreen";
const snakeBorder = "black";
const foodCColor = "red";
const foodBorder = "black";
const unitSize = 25;

// variables de logica de juego 
let runinggame = false;
let aVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake =
    [
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 }
    ];
window.addEventListener("keydown", changeDirection);
resetBtn.addEventLsitener("click", resetGame);

gameStart();
createFood();
drawFood();

function gameStart(){};
function nextTick(){};
function clearFood(){
    function randomFood(min,max){
        const randNum = Math.round((Math.random()*(max - min )+ min )/ unitSize );
        return randNum;
    }

    foodX = randomFood(0,gameWidth - unitSize);
    foodY = randomFood(0,gameHeight - unitSize);
    console.log(foodX, foodY);
};
function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX,foodY,unitSize, unitSize);
};
function moveSnake(){};
function drawSnake(){};
function changeDirection(){};
function checkGameOver(){};
function resetGame(){};