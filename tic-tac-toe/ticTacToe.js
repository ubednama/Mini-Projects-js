// Tic Tac Toe with Terminal Integration
class TicTacToe {
    constructor() {
        this.terminal = null;
        this.boxes = document.querySelectorAll(".game-cell");
        this.resetButton = document.querySelector("#resetBtn");
        this.newGameBtn = document.querySelector("#newBtn");
        this.turn = document.querySelector("#turnMsg");
        this.container = document.querySelector(".game-container");

        // Game mode elements
        this.pvpModeBtn = document.querySelector("#pvpMode");
        this.pvcModeBtn = document.querySelector("#pvcMode");
        this.difficultySection = document.querySelector("#difficultySection");
        this.easyModeBtn = document.querySelector("#easyMode");
        this.mediumModeBtn = document.querySelector("#mediumMode");
        this.hardModeBtn = document.querySelector("#hardMode");

        // Game state variables
        this.turnO = true;
        this.gameMode = 'pvp'; // 'pvp' or 'pvc'
        this.difficulty = 'easy'; // 'easy', 'medium', 'hard'
        this.gameActive = true;
        this.isComputerTurn = false;
        this.count = 0;

        // Chess notation mapping for tic-tac-toe grid
        this.positionMap = {
            0: 'A1', 1: 'A2', 2: 'A3',
            3: 'B1', 4: 'B2', 5: 'B3',
            6: 'C1', 7: 'C2', 8: 'C3'
        };

        this.winPatterns = [
            [0, 1, 2], [0, 4, 8], [0, 3, 6],
            [1, 4, 7], [2, 5, 8], [2, 4, 6],
            [3, 4, 5], [6, 7, 8]
        ];

        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeTerminal();
    }

    initializeTerminal() {
        if (window.TerminalUtils && window.TerminalUtils.TerminalUI) {
            this.terminal = new window.TerminalUtils.TerminalUI('tic-tac-toe');
            this.terminal.log('Tic-Tac-Toe v1.0 initialized...', 'system');
            this.terminal.log('Game reset. Player O starts.', 'system');
        }
    }

    bindEvents() {
        this.boxes.forEach((box, index) => {
            box.addEventListener("click", () => this.handleBoxClick(box, index));
        });

        this.resetButton.addEventListener("click", () => this.resetGame());

        this.newGameBtn.addEventListener("click", () => {
            this.resetGame();
            if (this.terminal) this.terminal.log('Starting new game...', 'system');
        });

        this.pvpModeBtn.addEventListener("click", () => {
            this.gameMode = 'pvp';
            this.pvpModeBtn.classList.add('active');
            this.pvcModeBtn.classList.remove('active');
            this.difficultySection.classList.add('hide');
            this.resetGame();
            if (this.terminal) this.terminal.log('Switched to Player vs Player mode', 'info');
        });

        this.pvcModeBtn.addEventListener("click", () => {
            this.gameMode = 'pvc';
            this.pvcModeBtn.classList.add('active');
            this.pvpModeBtn.classList.remove('active');
            this.difficultySection.classList.remove('hide');
            this.resetGame();
            if (this.terminal) this.terminal.log('Switched to Player vs Computer mode', 'info');
        });

        this.easyModeBtn.addEventListener("click", () => this.setDifficulty('easy'));
        this.mediumModeBtn.addEventListener("click", () => this.setDifficulty('medium'));
        this.hardModeBtn.addEventListener("click", () => this.setDifficulty('hard'));
    }

    setDifficulty(level) {
        this.difficulty = level;
        this.updateDifficultyButtons();
        if (this.terminal) this.terminal.log(`Difficulty set to ${level.toUpperCase()}`, 'info');
    }

    updateDifficultyButtons() {
        this.easyModeBtn.classList.remove('active');
        this.mediumModeBtn.classList.remove('active');
        this.hardModeBtn.classList.remove('active');

        if (this.difficulty === 'easy') this.easyModeBtn.classList.add('active');
        else if (this.difficulty === 'medium') this.mediumModeBtn.classList.add('active');
        else if (this.difficulty === 'hard') this.hardModeBtn.classList.add('active');
    }

    handleBoxClick(box, index) {
        if (!this.gameActive || this.isComputerTurn || box.disabled) return;

        const position = this.positionMap[index];
        const player = this.turnO ? "O" : "X";

        if (this.terminal) this.terminal.log(`${player} marked ${position}`, 'info');

        if (this.turnO) {
            box.innerText = "O";
            this.turnO = false;
        } else {
            box.innerText = "X";
            this.turnO = true;
        }
        box.disabled = true;
        this.count++;

        this.updateTurnMessage();

        let isWinner = this.checkWinner();

        if (this.count === 9 && !isWinner) {
            this.showDraw();
            return;
        }

        if (this.gameMode === 'pvc' && !isWinner && this.gameActive) {
            this.isComputerTurn = true;
            setTimeout(() => {
                this.makeComputerMove();
                this.isComputerTurn = false;
            }, 500);
        }
    }

    makeComputerMove() {
        if (!this.gameActive) return;

        let move;
        switch (this.difficulty) {
            case 'easy': move = this.getRandomMove(); break;
            case 'medium': move = this.getMediumMove(); break;
            case 'hard': move = this.getHardMove(); break;
            default: move = this.getRandomMove();
        }

        if (move !== -1) {
            const position = this.positionMap[move];
            this.boxes[move].innerText = "X";
            this.boxes[move].disabled = true;
            this.turnO = true;
            this.count++;

            if (this.terminal) this.terminal.log(`Computer (X) marked ${position}`, 'warning');

            this.updateTurnMessage();

            let isWinner = this.checkWinner();
            if (this.count === 9 && !isWinner) {
                this.showDraw();
            }
        }
    }

    getRandomMove() {
        let availableMoves = [];
        this.boxes.forEach((box, index) => {
            if (!box.disabled) availableMoves.push(index);
        });

        if (availableMoves.length > 0) {
            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
        return -1;
    }

    getMediumMove() {
        if (Math.random() < 0.5) return this.getHardMove();
        return this.getRandomMove();
    }

    getHardMove() {
        let winMove = this.findWinningMove('X');
        if (winMove !== -1) return winMove;

        let blockMove = this.findWinningMove('O');
        if (blockMove !== -1) return blockMove;

        if (!this.boxes[4].disabled) return 4;

        let corners = [0, 2, 6, 8];
        for (let corner of corners) {
            if (!this.boxes[corner].disabled) return corner;
        }

        return this.getRandomMove();
    }

    findWinningMove(player) {
        for (let pattern of this.winPatterns) {
            let [a, b, c] = pattern;
            let values = [this.boxes[a].innerText, this.boxes[b].innerText, this.boxes[c].innerText];

            if (values.filter(v => v === player).length === 2 && values.filter(v => v === '').length === 1) {
                if (this.boxes[a].innerText === '') return a;
                if (this.boxes[b].innerText === '') return b;
                if (this.boxes[c].innerText === '') return c;
            }
        }
        return -1;
    }

    checkWinner() {
        for (let pattern of this.winPatterns) {
            let pos1Val = this.boxes[pattern[0]].innerText;
            let pos2Val = this.boxes[pattern[1]].innerText;
            let pos3Val = this.boxes[pattern[2]].innerText;

            if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
                if (pos1Val === pos2Val && pos2Val === pos3Val) {
                    this.showWinner(pos1Val);
                    return true;
                }
            }
        }
        return false;
    }

    showWinner(winner) {
        this.gameActive = false;
        let winnerMessage;

        if (this.gameMode === 'pvc' && winner === 'X') {
            winnerMessage = `Computer Wins!`;
        } else if (this.gameMode === 'pvc' && winner === 'O') {
            winnerMessage = `You Win! Congratulations!`;
        } else {
            winnerMessage = `Congratulations, Winner is "${winner}"`;
        }

        this.turn.innerText = winnerMessage;
        this.turn.classList.add('success');
        this.disableBoxes();
        this.newGameBtn.classList.remove("hide");
        this.resetButton.classList.add("hide"); // Hide reset when game ends

        if (this.terminal) this.terminal.log(winnerMessage, 'success');
    }

    showDraw() {
        this.gameActive = false;
        const drawMessage = `Game is Draw`;
        this.turn.innerText = drawMessage;
        this.disableBoxes();
        this.newGameBtn.classList.remove("hide");
        this.resetButton.classList.add("hide"); // Hide reset when game ends
        if (this.terminal) this.terminal.log(drawMessage, 'warning');
    }

    resetGame() {
        this.turnO = true;
        this.gameActive = true;
        this.isComputerTurn = false;
        this.enableBoxes();
        this.container.classList.remove("hide");
        this.count = 0;
        this.updateTurnMessage();

        // Ensure correct button state
        this.newGameBtn.classList.add("hide");
        this.resetButton.classList.remove("hide");

        if (this.terminal) this.terminal.log('Game reset. Player O starts.', 'system');
    }

    enableBoxes() {
        for (let box of this.boxes) {
            box.disabled = false;
            box.innerText = "";
        }
        this.newGameBtn.classList.add("hide");
    }

    disableBoxes() {
        for (let box of this.boxes) {
            box.disabled = true;
        }
    }

    updateTurnMessage() {
        if (!this.gameActive) return;
        if (this.gameMode === 'pvc' && !this.turnO) {
            this.turn.innerText = "Computer's turn";
        } else {
            this.turn.innerText = this.turnO ? "O turn" : "X turn";
        }
        this.turn.classList.remove('success');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
