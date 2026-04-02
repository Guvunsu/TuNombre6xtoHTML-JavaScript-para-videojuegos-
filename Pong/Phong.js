let board;
let boadWidth = 500;
let boadHeight = 500;
let context;
let restartButton;

let playerWidth = 10;
let playerHeight = 50;
let playerVelocityY = 0;

//-------------------------------------------------------------------------
let player1 = {
  x: 10,
  y: boadHeight / 2,
  width: playerWidth,
  height: playerHeight,
  velocityY: playerVelocityY,
};
//--------------------------------------------------------------------------
let player2 = {
  x: boadWidth - playerWidth - 10,
  y: boadHeight / 2,
  width: playerWidth,
  height: playerHeight,
  velocityY: playerVelocityY,
};

let ballWidth = 10;
let ballHeight = 10;
let ball = {
  x: boadWidth / 2,
  y: boadWidth / 2,
  width: ballWidth,
  height: ballHeight,
  velocityX: 1,
  velocityY: 2,
};
let player2Score = 0;
let player1Score = 0;

//--------------------------------------------------------------------------
window.onload = function () {
  board = document.getElementById("board");
  restartButton = document.querySelector("#resetBtn");
  board.height = boadHeight;
  board.width = boadWidth;
  context = board.getContext("2d");

  // draw initial player 1
  context.fillStyle = "aquamarine";
  context.fillRect(player1.x, player1.y, player1.width, player1.height);
  this.requestAnimationFrame(update);
  document.addEventListener("keyup", movePlayer);
  restartButton.addEventListener("click", newGame);
};

//---------------------------------------------------------------------------
function update() {
  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);

  //Player1
  let nextPlayer1Y = player1.y + player1.velocityY;
  if (!outOfBounds(nextPlayer1Y)) {
    player1.y = nextPlayer1Y;
  }
  context.fillStyle = "aquamarine";
  context.fillRect(player1.x, player1.y, player1.width, player1.height);

  //player2
  let nextPlayer2Y = player2.y + player2.velocityY;
  if (!outOfBounds(nextPlayer2Y)) {
    player2.y = nextPlayer2Y;
  }
  context.fillRect(player2.x, player2.y, player2.width, player2.height);

  //Ball
  context.fillStyle = "gold";
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
  context.fillRect(ball.x, ball.y, ball.width, ball.height);
  if (ball.y <= 0 || ball.y + ball.height >= boadHeight) {
    ball.velocityY *= -1; //cambie de direccion
  }

  // bounce the ball back
  if (detectCollision(ball, player1)) {
    if (ball.x <= player1.x + player1.width) {
      ball.velocityX *= -1;
    }
  }
  else if (detectCollision(ball, player2)) {
    if (ball.x + ballWidth >= player2.x) {
      ball.velocityX *= -1;
    }
  }
  //score
  if (ball.x < 0) {
    player2Score++;
    resetGame(1);
  }
  else if (ball.x + ballWidth > boadWidth) {
    player1Score++;
    resetGame(-1);
  }

  context.font = "50px sans-serif";
  context.fillText(player1Score, boadWidth / 5, 45);
  context.fillText(player2Score, boadWidth * 4 / 5, 45);

  //middle line
  for (let i = 10; i < board.height; i += 25) {
    // i = starting Y position, draw a sqare every 25
    //(x position = half of boardwidth -10),i= y position,width = 5,height =5
    context.fillRect(board.width / 2, i, 5, 5);
  }
}
//---------------------------------------------------------------------------
function outOfBounds(yPostion) {
  return yPostion < 0 || yPostion + playerHeight > boadHeight;
}
//---------------------------------------------------------------------------
function movePlayer(keyEvent) {
  //player 1 input
  if (keyEvent.code == "KeyW") {
    player1.velocityY = -3;
  } else if (keyEvent.code == "KeyS") {
    player1.velocityY = 3;
  }
  //player 2 input
  if (keyEvent.code == "ArrowUp") {
    player2.velocityY = -3;
  } else if (keyEvent.code == "ArrowDown") {
    player2.velocityY = 3;
  }
}
//---------------------------------------------------------------------------
function detectCollision(a, b) {
  return (
    a.x < b.x + b.width && // a´s top left corner doesnt reach b´s top right corner
    a.x + a.width > b.x && // a´s top right corner passes b´s top left corner
    a.y < b.y + b.height && // a´s top left corner doesnt reach b´s bottom left corner
    a.y + a.height > b.y //a´s bottomleft corner passes b´s top left corner
  );
}
//---------------------------------------------------------------------------
function resetGame(direction) {
  ball = {
    x: boadWidth / 2,
    y: boadWidth / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: direction,
    velocityY: 2,
  };
}
//---------------------------------------------------------------------------
function newGame() {
  player1Score = 0;
  player2Score = 0;

  player1 = {
    x: 10,
    y: boadHeight / 2,
    width: playerWidth,
    height: playerHeight,
    velocityY: playerVelocityY,
  };
  player2 = {
    x: boadWidth - playerWidth - 10,
    y: boadHeight / 2,
    width: playerWidth,
    height: playerHeight,
    velocityY: playerVelocityY,
  };
  ball = {
    x: boadWidth / 2,
    y: boadWidth / 2,
    width: ballWidth,
    height: ballHeight,
    velocityX: 1,
    velocityY: 2,
  };
}

