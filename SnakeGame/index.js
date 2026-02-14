// variables visuales del j
const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const highScoreText = document.querySelector("#highScoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "green";
const snakeCaolor = "blue";
const snakeBorder = "black";
const foodColor = "red";
const foodBorder = "black";
const unitSize = 25;
//nuevo
const playBtn = document.querySelector("#playBtn");
// variables de logica de juego
let runinggame = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
let snake = [
  { x: unitSize * 3, y: 0 },
  { x: unitSize * 2, y: 0 },
  { x: unitSize, y: 0 },
  { x: 0, y: 0 },
];
let timeOut;

window.addEventListener("keydown", changeDirection);
window.addEventListener("click", checkAndSaveScore)//nuevo
resetBtn.addEventListener("click", startFromButton);
//gameStart();
//----------------------------------------------------------------------------------------------
function startFromButton(){

  if(runinggame) return; //por si acaso <-<

  score = 0;
  xVelocity = unitSize;
  yVelocity = 0;

  snake = [
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];

  gameStart();
}
//------------------------------------------------------------------------------------------------
function gameStart() {
  playBtn.disabled = true;                       
  runinggame = true;
  checkAndSaveScore();//nuevo
  scoreText.textContent = score;
  highScoreText.textContent = "highScore: " + highScore;
  createFood();
  drawFood();
  nextTick();
}
//--------------------------------------------------------------------------------------------
function nextTick() {
  // update method
  if (runinggame) {
    setTimeout(() => {
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    }, 150);
  } else {
    displayGameOver();
  }
}
//--------------------------------------------------------------------------------------
function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}
//----------------------------------------------------------------------------------------
function createFood() {
  function randomFood(min, max) {
    const randNum =
      Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randNum;
  }
  foodX = randomFood(0, gameWidth - unitSize);
  foodY = randomFood(0, gameHeight - unitSize);
  console.log(foodX, foodY);
}
//-------------------------------------------------------------------------------------------------------
function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(foodX, foodY, unitSize, unitSize);
}
//--------------------------------------------------------------------------------------------------------
function moveSnake() {
  const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
  snake.unshift(head);
  // si se comio la comida
  if (snake[0].x == foodX && snake[0].y == foodY) {
    score += 1;
    scoreText.textContent = score;
    createFood();
  } else {
    snake.pop();
  }
}
//------------------------------------------------------------------------------------------------------
function drawSnake() {
  ctx.fillStyle = snakeCaolor;
  ctx.strokeStyle = snakeBorder;
  snake.forEach((snakePart) => {
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  });
}
//------------------------------------------------------------------------------------------------------
//modificado para que fucionara tambien las teclas WASD
function changeDirection(event) {
  if(!runinggame) return;//porque si no se mueve aunque este el boton de play activado
  const keyPressed = event.key.toLowerCase();
  const LEFT = "arrowleft";
  const RIGHT = "arrowright";
  const UP = "arrowup";
  const DOWN = "arrowdown";
  
  const A = "a";
  const D = "d";
  const W = "w";
  const S = "s";
  //const keyPressed = event.keyPressed;
  /*
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;
    */
  // console.log(keyPressed);

  const goingUP = yVelocity == -unitSize;
  const goingDOWN = yVelocity == unitSize;
  const goingRIGHT = xVelocity == unitSize;
  const goingLEFT = xVelocity == -unitSize;

  switch (true) {
    case (keyPressed === "arrowleft" || keyPressed === "a") && !goingRIGHT:
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case (keyPressed === "arrowright" || keyPressed === "d") && !goingLEFT:
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case (keyPressed === "arrowup" || keyPressed === "w") && !goingDOWN:
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case (keyPressed === "arrowdown" || keyPressed === "s") && !goingUP:
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
}
//-----------------------------------------------------------------------------------------------------
function checkGameOver() {
  switch (true) {
    case snake[0].x < 0:
      runinggame = false;
      break;
    case snake[0].x >= gameWidth:
      runinggame = false;
      break;
    case snake[0].y < 0:
      runinggame = false;
      break;
    case snake[0].y >= gameHeight:
      runinggame = false;
      break;
  }
  for (let i = 1; i < snake.length; i += 1) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      runinggame = false;
    }
  }
}
//------------------------------------------------------------------------------------------------
function displayGameOver() {
  playBtn.disabled = false;
  ctx.font = "70px Arial";
  ctx.fillStyle = "red";
  ctx.texAlign = "center";
  ctx.fillText("GameOver", gameWidth / 2, gameHeight / 2);
  runinggame = false;
  if (!runinggame) {
    highScore = score;
    highScoreText.textContent = "highScore:" + highScore;
    localStorage.setItem("snakeHighScore", highScore);
  }
}
//------------------------------------------------------------------------------------------
function checkAndSaveScore() {
  if (scoreText === null || highScore > parseInt(scoreText)) {
    localStorage.setItem("snakeHighScore", highScore);
  }
}
//-----------------------------------------------------------------------------------------
function resetGame() {
  score = 0;
  xVelocity = unitSize;
  yVelocity = 0;
  snake = [
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 },
  ];
  gameStart();
}
//---------------------------------------------------------------------------------------

// nombre jugador y boton de play