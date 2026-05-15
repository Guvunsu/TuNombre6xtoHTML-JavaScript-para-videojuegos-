//ROCK PAPER SCISSORS

const restartBtn = document.getElementById("restartBtn");

const choices = ["rock", "paper", "scissors"];

const playerDisplay = document.getElementById("playerDisplay");
const computerDisplay = document.getElementById("computerDisplay");
const resultDisplay = document.getElementById("resultDisplay");

const playerScoreDisplay = document.getElementById("playerScore");
const computerScoreDisplay = document.getElementById("computerScore");

let playerScore = 0;
let computerScore = 0;

//AUDIOS
const clickSound = new Audio("./Nani.mp3");
const winSound = new Audio("./Fahh.mp3");
const loseSound = new Audio("./GRITO DE HOMBE.mp3");
const tieSound = new Audio("./chale me humillo.mp3");

//BOTON RESTART
restartBtn.addEventListener("click", () => {

    clickSound.currentTime = 0;
    clickSound.play();

    restartGame();
});

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

    //SONIDO CLICK
    clickSound.currentTime = 0;
    clickSound.play();

    const computerChoice = choices[Math.floor(Math.random() * 3)];

    let result = "";

    if (playerChoice === computerChoice) {

        result = "It's a tie!";

    } else {

        switch (playerChoice) {

            case "rock":
                result = (computerChoice === "scissors")
                    ? "You win!"
                    : "Computer wins!";
                break;

            case "paper":
                result = (computerChoice === "rock")
                    ? "You win!"
                    : "Computer wins!";
                break;

            case "scissors":
                result = (computerChoice === "paper")
                    ? "You win!"
                    : "Computer wins!";
                break;
        }
    }

    playerDisplay.textContent = `Player: ${playerChoice}`;
    computerDisplay.textContent = `Computer: ${computerChoice}`;

    resultDisplay.textContent = result;

    resultDisplay.classList.remove("greenText", "redText");

    switch (result) {

        case "You win!":

            winSound.currentTime = 0;
            winSound.play();

            resultDisplay.classList.add("greenText");

            playerScore++;

            playerScoreDisplay.textContent = `Player: ${playerScore}`;

            break;

        case "Computer wins!":

            loseSound.currentTime = 2;
            loseSound.play();

            resultDisplay.classList.add("redText");

            computerScore++;

            computerScoreDisplay.textContent = `Computer: ${computerScore}`;

            break;

        default:

            tieSound.currentTime = 0;
            tieSound.play();

            break;
    }
}