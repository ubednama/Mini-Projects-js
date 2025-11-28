// Rock Paper Scissors with Terminal Integration
class RockPaperScissors {
    constructor() {
        this.terminal = null;
        this.userScore = 0;
        this.compScore = 0;
        this.difficulty = 'medium';
        this.userHistory = [];
        this.gameCount = 0;

        this.choices = document.querySelectorAll(".choice");
        this.msg = document.querySelector("#msg");
        this.compScoreText = document.querySelector("#compScore");
        this.userScoreText = document.querySelector("#userScore");

        this.easyModeBtn = document.querySelector("#easy-mode");
        this.mediumModeBtn = document.querySelector("#medium-mode");
        this.hardModeBtn = document.querySelector("#hard-mode");

        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeTerminal();
        this.updateDifficultyButtons();
    }

    initializeTerminal() {
        if (window.TerminalUtils && window.TerminalUtils.TerminalUI) {
            this.terminal = new window.TerminalUtils.TerminalUI('rock-paper-scissors');
            this.terminal.log('Rock Paper Scissors v2.0 initialized...', 'system');
            this.terminal.log('Select difficulty and make your move!', 'info');
        }
    }

    bindEvents() {
        this.choices.forEach((choice) => {
            choice.addEventListener("click", () => {
                const userChoice = choice.getAttribute('id');
                this.playGame(userChoice);
            });
        });

        this.easyModeBtn.addEventListener("click", () => this.setDifficulty('easy'));
        this.mediumModeBtn.addEventListener("click", () => this.setDifficulty('medium'));
        this.hardModeBtn.addEventListener("click", () => this.setDifficulty('hard'));
    }

    setDifficulty(level) {
        this.difficulty = level;
        this.updateDifficultyButtons();
        this.resetGame();
        if (this.terminal) this.terminal.log(`Difficulty set to ${level.toUpperCase()}`, 'info');
    }

    updateDifficultyButtons() {
        [this.easyModeBtn, this.mediumModeBtn, this.hardModeBtn].forEach(btn => btn.classList.remove('active'));
        if (this.difficulty === 'easy') this.easyModeBtn.classList.add('active');
        else if (this.difficulty === 'medium') this.mediumModeBtn.classList.add('active');
        else if (this.difficulty === 'hard') this.hardModeBtn.classList.add('active');
    }

    resetGame() {
        this.userScore = 0;
        this.compScore = 0;
        this.userHistory = [];
        this.gameCount = 0;
        this.userScoreText.innerText = this.userScore;
        this.compScoreText.innerText = this.compScore;
        this.msg.innerText = `Play your Move (${this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1)} Mode)`;
        this.msg.style.backgroundColor = "var(--bg-card)";
        if (this.terminal) this.terminal.log('Game reset', 'system');
    }

    playGame(userChoice) {
        this.userHistory.push(userChoice);
        this.gameCount++;
        if (this.userHistory.length > 10) this.userHistory.shift();

        const compChoice = this.genCompChoice();

        if (this.terminal) this.terminal.log(`You chose ${userChoice}`, 'info');

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
    }

    genCompChoice() {
        const options = ["rock", "paper", "scissors"];
        switch (this.difficulty) {
            case 'easy': return options[Math.floor(Math.random() * 3)];
            case 'medium': return this.getMediumChoice();
            case 'hard': return this.getHardChoice();
            default: return options[Math.floor(Math.random() * 3)];
        }
    }

    getMediumChoice() {
        const options = ["rock", "paper", "scissors"];
        if (Math.random() < 0.7 || this.userHistory.length < 3) {
            return options[Math.floor(Math.random() * 3)];
        }
        const mostFrequent = this.getMostFrequentChoice();
        return this.getCounterChoice(mostFrequent);
    }

    getHardChoice() {
        const options = ["rock", "paper", "scissors"];
        if (this.userHistory.length < 2) return options[Math.floor(Math.random() * 3)];

        if (this.userHistory.length >= 3) {
            const lastThree = this.userHistory.slice(-3);
            if (lastThree[0] === lastThree[1] && lastThree[1] === lastThree[2]) {
                return this.getCounterChoice(lastThree[2]);
            }
            if (lastThree[0] === lastThree[2] && lastThree[0] !== lastThree[1]) {
                return this.getCounterChoice(lastThree[0]);
            }
        }

        if (Math.random() < 0.6) {
            const mostFrequent = this.getMostFrequentChoice();
            return this.getCounterChoice(mostFrequent);
        }

        return options[Math.floor(Math.random() * 3)];
    }

    getMostFrequentChoice() {
        if (this.userHistory.length === 0) return "rock";
        const counts = { rock: 0, paper: 0, scissors: 0 };
        this.userHistory.forEach(choice => counts[choice]++);
        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    }

    getCounterChoice(userChoice) {
        const counters = { rock: "paper", paper: "scissors", scissors: "rock" };
        return counters[userChoice];
    }

    showWinner(userWin, userChoice, compChoice) {
        if (userWin) {
            this.userScore++;
            this.msg.innerText = `You Won! ${userChoice} beats ${compChoice}`;
            this.msg.style.backgroundColor = "var(--success-color)";
            this.userScoreText.innerText = this.userScore;
            if (this.terminal) this.terminal.log(`Victory! ${userChoice} beats ${compChoice}`, 'success');
        } else {
            this.compScore++;
            this.msg.innerText = `You Lost! ${compChoice} beats ${userChoice}`;
            this.msg.style.backgroundColor = "var(--error-color)";
            this.compScoreText.innerText = this.compScore;
            if (this.terminal) this.terminal.log(`Defeat! ${compChoice} beats ${userChoice}`, 'error');
        }
    }

    drawGame() {
        this.msg.innerText = "Draw... Play again";
        this.msg.style.backgroundColor = "var(--bg-card)";
        if (this.terminal) this.terminal.log(`Draw! Both chose same option`, 'warning');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new RockPaperScissors();
});