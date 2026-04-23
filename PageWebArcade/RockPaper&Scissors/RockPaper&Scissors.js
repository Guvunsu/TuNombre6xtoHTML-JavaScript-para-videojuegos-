//ROCK PAPER SCISSORS
const restartBtn = document.getElementById("restartBtn");
restartBtn.addEventListener("click", restartGame);
const choices = ["rock", "paper", "scissors"];
const playerDisplay = document.getElementById("playerDisplay");
const computerDisplay = document.getElementById("computerDisplay");
const resultDisplay = document.getElementById("resultDisplay");
const playerScoreDisplay = document.getElementById("playerScore");
const computerScoreDisplay = document.getElementById("computerScore");
let playerScore = 0;
let computerScore = 0;

function restartGame() {
    playerScore = 0;
    computerScore = 0;

    playerDisplay.textContent = "Player:";
    computerDisplay.textContent = "Computer:";
    resultDisplay.textContent = "Choose your move";

    playerScoreDisplay.textContent = "Player: 0";
    computerScoreDisplay.textContent = "Computer: 0";

    resultDisplay.classList.remove("greenText", "redText");
}

function playGame(playerChoice) {
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    let result = "";

    if (playerChoice === computerChoice) {
        result = "It's a tie!";
    } else {
        switch (playerChoice) {
            case "rock":
                result = (computerChoice === "scissors") ? "You win!" : "Computer wins!";
                break;
            case "paper":
                result = (computerChoice === "rock") ? "You win!" : "Computer wins!";
                break;
            case "scissors": result = (computerChoice === "paper") ? "You win!" : "Computer wins!";
                break;
        }
    }
    playerDisplay.textContent = `Player: ${playerChoice}`;
    computerDisplay.textContent = `Computer: ${computerChoice}`;
    resultDisplay.textContent = result;

    resultDisplay.classList.remove("greenText", "redText");

    switch (result) {
        case "You win!":
            resultDisplay.classList.add("greenText");
            playerScore++;
            playerScoreDisplay.textContent = `Player: ${playerScore}`;
            break;
        case "Computer wins!":
            resultDisplay.classList.add("redText");
            computerScore++;
            computerScoreDisplay.textContent = `Computer: ${computerScore}`;
            break;
    }
}