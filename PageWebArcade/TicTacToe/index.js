const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const RestartButton = document.querySelector("#RestartButton");

const winCondition = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isRunning = false;
// AUDIOS
const xSound = new Audio("./What.mp3");
const oSound = new Audio("./Duh.mp3");
const winSound = new Audio("./Yamete kudasai.mp3");
const drawSound = new Audio("./OMG.mp3");
const restartSound = new Audio("./restartSound.mp3");
// START GAME
initializeGame();

function initializeGame() {
  cells.forEach((cell) =>
    cell.addEventListener("click", cellClicked)
  );
  RestartButton.addEventListener("click", () => {
    restartSound.currentTime = 0;
    restartSound.play();
    restartGame();
  });
  statusText.textContent = `${currentPlayer}'s turn`;
  isRunning = true;
}
// CELL CLICK
function cellClicked() {
  const cellIndex = this.getAttribute("cellIndex");
  if (options[cellIndex] != "" || !isRunning) {
    return;
  }
  updateCell(this, cellIndex);
  checkWinner();
}
// UPDATE CELL
function updateCell(cell, index) {
  options[index] = currentPlayer;
  cell.textContent = currentPlayer;
  //SONIDO X
  if (currentPlayer === "X") {

    xSound.currentTime = 0;
    xSound.play();
  }
  //SONIDO O
  else {

    oSound.currentTime = 0;
    oSound.play();
  }
}
// CHANGE PLAYER
function changePlayer() {
  currentPlayer = currentPlayer == "X" ? "O" : "X";
  statusText.textContent = `${currentPlayer}'s turn`;
}
// CHECK WINNER
function checkWinner() {
  let roundWin = false;
  for (let i = 0; i < winCondition.length; i++) {

    const condition = winCondition[i];
    const cellA = options[condition[0]];
    const cellB = options[condition[1]];
    const cellC = options[condition[2]];

    if (cellA == "" || cellB == "" || cellC == "") {
      continue;
    }
    if (cellA == cellB && cellB == cellC) {
      roundWin = true;
      break;
    }
  }

  //GANADOR
  if (roundWin) {
    winSound.currentTime = 0;
    winSound.play();
    statusText.textContent = `${currentPlayer} wins!`;
    isRunning = false;
  }
  //EMPATE
  else if (!options.includes("")) {
    drawSound.currentTime = 0;
    drawSound.play();
    statusText.textContent = `Draw!`;
    isRunning = false;
  }
  //SIGUE EL JUEGO
  else {
    changePlayer();
  }
}
// RESTART GAME
function restartGame() {
  currentPlayer = "X";
  options = ["", "", "", "", "", "", "", "", ""];
  isRunning = true;

  statusText.textContent = `${currentPlayer}'s turn`;
  cells.forEach((cell) => {
    cell.textContent = "";
  });
}