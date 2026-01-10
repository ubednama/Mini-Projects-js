// Rock Paper Scissors - Shuffler Version

class RockPaperScissors {
    constructor() {
        this.userScore = 0;
        this.compScore = 0;
        this.isShuffling = false;
        this.shuffleInterval = null;

        // Game Assets
        this.icons = {
            rock: '✊', // Or 🪨
            paper: '✋', // Or 📄
            scissors: '✌️' // Or ✂️
        };
        this.displayIcons = ['✊', '✋', '✌️']; // For shuffling

        this.choices = document.querySelectorAll(".choice");
        this.msg = document.querySelector("#msg");
        this.compScoreText = document.querySelector("#compScore");
        this.userScoreText = document.querySelector("#userScore");
        this.shufflerIcon = document.querySelector("#shufflerIcon");

        this.init();
    }

    init() {
        this.bindEvents();
        this.startShuffling();
    }

    bindEvents() {
        this.choices.forEach((choice) => {
            choice.addEventListener("click", () => {
                const userChoice = choice.getAttribute('id');
                // Use a flag to prevent multiple clicks while waiting for restart
                if (!this.isShuffling) return;

                this.playGame(userChoice);
            });
        });
    }

    startShuffling() {
        this.isShuffling = true;
        this.msg.innerText = "Choose your move...";
        this.msg.className = ""; // Reset classes

        let index = 0;
        this.shuffleInterval = setInterval(() => {
            this.shufflerIcon.innerText = this.displayIcons[index];
            index = (index + 1) % this.displayIcons.length;
        }, 100); // Fast shuffle
    }

    stopShuffling() {
        clearInterval(this.shuffleInterval);
        this.isShuffling = false;
    }

    playGame(userChoice) {
        this.stopShuffling();

        // Determine Computer Choice Randomly
        const options = ["rock", "paper", "scissors"];
        const compChoice = options[Math.floor(Math.random() * 3)];

        // Display Computer Choice
        this.shufflerIcon.innerText = this.icons[compChoice];

        if (userChoice === compChoice) {
            this.drawGame();
        } else {
            let userWin = true;
            if (userChoice === 'rock') {
                userWin = compChoice === "paper" ? false : true;
            } else if (userChoice === "paper") {
                userWin = compChoice === "scissors" ? false : true;
            } else {
                userWin = compChoice === "rock" ? false : true;
            }
            this.showWinner(userWin, userChoice, compChoice);
        }

        // Restart after delay
        setTimeout(() => {
            this.startShuffling();
        }, 2000);
    }

    showWinner(userWin, userChoice, compChoice) {
        if (userWin) {
            this.userScore++;
            this.msg.innerText = `You Won! ${userChoice} beats ${compChoice}`;
            this.msg.classList.add("win");
            this.userScoreText.innerText = this.userScore;
        } else {
            this.compScore++;
            this.msg.innerText = `You Lost! ${compChoice} beats ${userChoice}`;
            this.msg.classList.add("loss");
            this.compScoreText.innerText = this.compScore;
        }
    }

    drawGame() {
        this.msg.innerText = "Draw!";
        this.msg.classList.add("draw");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RockPaperScissors();
});