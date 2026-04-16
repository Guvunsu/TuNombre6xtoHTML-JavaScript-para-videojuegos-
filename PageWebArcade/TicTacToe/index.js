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

initializeGame();

function initializeGame() {
  cells.forEach((cell) => cell.addEventListener("click", cellClicked));
  RestartButton.addEventListener("click", restartGame);
  statusText.textContent = `${currentPlayer}´s turn`;
  isRunning = true;
}

function cellClicked() {
  const cellIndex = this.getAttribute("cellIndex");
  if (options[cellIndex] != "" || !isRunning) {
    return;
  }
  updateCell(this, cellIndex);
  checkWinner();
}

function updateCell(cell, index) {
  options[index] = currentPlayer;
  cell.textContent = currentPlayer;
}

function changePlayer() {
  currentPlayer = currentPlayer == "X" ? "O" : "X";
  statusText.textContent = `${currentPlayer}´s turn`;
}

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
  if (roundWin) {
    statusText.textContent = `${currentPlayer}´wins!`;
    isRunning = false;
  } else if (!options.includes("")) {
    statusText.textContent = `Draw!`;
    isRunning = false;
  } else {
    changePlayer();
  }
}

function restartGame() {
  currentPlayer = "X";
  options = ["", "", "", "", "", "", "", "", ""];
  statusText.textContent = `${currentPlayer}´s turn`;
  cells.forEach((Cell) => (cell.textContent = ""));
  isRunning = true;
}
