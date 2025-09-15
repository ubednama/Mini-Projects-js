// # tictactoe-js
let boxes = document.querySelectorAll(".game-cell");
let resetButton = document.querySelector("#resetBtn");
let newGameBtn = document.querySelector("#newBtn");
let winMsg = document.querySelector("#msg")
let container = document.querySelector(".game-container");
let turn = document.querySelector("#turnMsg");

// Game mode elements
let pvpModeBtn = document.querySelector("#pvpMode");
let pvcModeBtn = document.querySelector("#pvcMode");
let difficultySection = document.querySelector("#difficultySection");
let easyModeBtn = document.querySelector("#easyMode");
let mediumModeBtn = document.querySelector("#mediumMode");
let hardModeBtn = document.querySelector("#hardMode");

// Game state variables
let turnO = true;
let gameMode = 'pvp'; // 'pvp' or 'pvc'
let difficulty = 'easy'; // 'easy', 'medium', 'hard'
let gameActive = true;
let isComputerTurn = false;

// Terminal integration variables
let currentInput = '';
let isInteractingWithApp = false;

// Chess notation mapping for tic-tac-toe grid
const positionMap = {
    0: 'A1', 1: 'A2', 2: 'A3',
    3: 'B1', 4: 'B2', 5: 'B3', 
    6: 'C1', 7: 'C2', 8: 'C3'
};

const reversePositionMap = {
    'A1': 0, 'A2': 1, 'A3': 2,
    'B1': 3, 'B2': 4, 'B3': 5,
    'C1': 6, 'C2': 7, 'C3': 8
};

// Get current cursor line for terminal interaction
function getCurrentCursorLine() {
    return document.querySelector('.line:last-child .cursor');
}

// Update terminal cursor with current input
function updateTerminalCursor(value) {
    const cursorLine = getCurrentCursorLine();
    if (cursorLine) {
        cursorLine.textContent = value + '_';
    }
}

// Add terminal output line
function addTerminalLine(content, isCommand = false) {
    const terminalOutput = document.querySelector('.terminal-output');
    if (!terminalOutput) return;
    
    const line = document.createElement('div');
    line.className = 'line';
    
    if (isCommand) {
        line.innerHTML = `<span class="prompt">user@tic-tac-toe:~$</span> <span class="command">${content}</span>`;
    } else {
        line.innerHTML = `<span class="output">${content}</span>`;
    }
    
    // Insert before cursor line
    const cursorLine = terminalOutput.querySelector('.line:last-child');
    if (cursorLine && cursorLine.innerHTML.includes('cursor')) {
        terminalOutput.insertBefore(line, cursorLine);
    } else {
        terminalOutput.appendChild(line);
    }
    
    // Limit terminal messages
    TerminalMessages.limitTerminalMessages();
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

const winPatterns = [
    [0,1,2],
    [0,4,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8],
];

const enableBoxes = () => {
    for(let box of boxes){
        box.disabled = false;
        box.innerText="";
        winMsg.classList.add("hide");
        newGameBtn.classList.add("hide");
    }
};

const resetGame = () => {
    turnO = true;
    gameActive = true;
    isComputerTurn = false;
    enableBoxes();
    container.classList.remove("hide");
    count = 0;
    updateTurnMessage();
};

// Game mode switching
pvpModeBtn.addEventListener("click", () => {
    gameMode = 'pvp';
    pvpModeBtn.classList.add('active');
    pvcModeBtn.classList.remove('active');
    difficultySection.classList.add('hide');
    resetGame();
});

pvcModeBtn.addEventListener("click", () => {
    gameMode = 'pvc';
    pvcModeBtn.classList.add('active');
    pvpModeBtn.classList.remove('active');
    difficultySection.classList.remove('hide');
    resetGame();
});

// Difficulty selection
easyModeBtn.addEventListener("click", () => {
    difficulty = 'easy';
    updateDifficultyButtons();
});

mediumModeBtn.addEventListener("click", () => {
    difficulty = 'medium';
    updateDifficultyButtons();
});

hardModeBtn.addEventListener("click", () => {
    difficulty = 'hard';
    updateDifficultyButtons();
});

function updateDifficultyButtons() {
    // Only remove active class from difficulty buttons, not all terminal options
    easyModeBtn.classList.remove('active');
    mediumModeBtn.classList.remove('active');
    hardModeBtn.classList.remove('active');
    
    if (difficulty === 'easy') easyModeBtn.classList.add('active');
    else if (difficulty === 'medium') mediumModeBtn.classList.add('active');
    else if (difficulty === 'hard') hardModeBtn.classList.add('active');
}

function updateTurnMessage() {
    if (gameMode === 'pvc' && !turnO) {
        turn.innerText = "Computer's turn";
    } else {
        turn.innerText = turnO ? "O turn" : "X turn";
    }
}

newGameBtn.addEventListener("click", () => {
    container.classList.remove("hide");
    enableBoxes();
    console.log("New game");
    count=0;
});

resetButton.addEventListener("click", () =>{
    enableBoxes();
    console.log("Game Reset.")
});

let count = 0;
boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        if (!gameActive || isComputerTurn || box.disabled) return;
        
        const position = positionMap[index];
        const player = turnO ? "O" : "X";
        
        // Log command to terminal
        addTerminalLine(position, true);
        // Log move result
        addTerminalLine(`${player} moves to ${position}`);
        
        if(turnO === true){
            box.innerText = "O";
            turnO = false;
        }
        else{
            box.innerText = "X";
            turnO = true;
        }
        box.disabled = true;
        count++;
        
        updateTurnMessage();
        
        let isWinner = checkWinner();
        
        if(count === 9 && !isWinner){
            showDraw();
            return;
        }
        
        // Computer move in PvC mode
        if (gameMode === 'pvc' && !isWinner && gameActive) {
            isComputerTurn = true;
            setTimeout(() => {
                makeComputerMove();
                isComputerTurn = false;
            }, 500); // Delay for better UX
        }
    });
});

// Terminal Integration
class TicTacToeTerminal {
    static processCommand(command) {
        const cmd = command.toUpperCase().trim();
        
        // Check if it's a valid position (A1, B2, etc.)
        if (reversePositionMap.hasOwnProperty(cmd)) {
            const index = reversePositionMap[cmd];
            const box = boxes[index];
            
            if (!box.disabled && gameActive && !isComputerTurn) {
                // Simulate click on the box
                box.click();
                return null;
            } else {
                return `Position ${cmd} is already taken or game not active`;
            }
        }
        
        // Game commands
        if (cmd === 'RESET') {
            resetGame();
            addTerminalLine('Game reset');
            return null;
        }
        
        if (cmd === 'NEW') {
            if (!newGameBtn.classList.contains('hide')) {
                newGameBtn.click();
                return null;
            }
            return 'New game not available';
        }
        
        // System commands
        const systemCommands = {
            'WHOAMI': 'ubednama',
            'PWD': '/home/ubednama/tic-tac-toe',
            'HELP': `Tic-Tac-Toe Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎮 GAME MOVES:
  A1, A2, A3             → Top row positions
  B1, B2, B3             → Middle row positions  
  C1, C2, C3             → Bottom row positions

🎯 GAME CONTROLS:
  reset                  → Reset current game
  new                    → Start new game (after win/draw)

🖥️  SYSTEM:
  help                   → Show this help message
  whoami                 → Show current user
  pwd                    → Show current directory

💡 GAME BOARD LAYOUT:
     1   2   3
  A  □ | □ | □
     __|___|__
  B  □ | □ | □  
     __|___|__
  C  □ | □ | □
       |   |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        };
        
        if (systemCommands[cmd]) {
            return systemCommands[cmd];
        }
        
        return `Invalid move: ${command}. Try positions like A1, B2, C3`;
    }
}

// Global keyboard handler for tic-tac-toe
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    const cursorLine = getCurrentCursorLine();
    if (!cursorLine) return;
    
    if (e.key === 'Enter') {
        const command = cursorLine.textContent.replace('_', '').trim();
        
        if (command) {
            addTerminalLine(command, true);
            const result = TicTacToeTerminal.processCommand(command);
            if (result) {
                addTerminalLine(result);
            }
            updateTerminalCursor('');
        }
        e.preventDefault();
    } else if (e.key === 'Backspace') {
        const currentText = cursorLine.textContent.replace('_', '');
        cursorLine.textContent = currentText.slice(0, -1) + '_';
        e.preventDefault();
    } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const currentText = cursorLine.textContent.replace('_', '');
        cursorLine.textContent = currentText + e.key + '_';
        e.preventDefault();
    }
});

// Initialize terminal
document.addEventListener('DOMContentLoaded', function() {
    updateTerminalCursor('');
});

// AI Logic
function makeComputerMove() {
    if (!gameActive) return;
    
    let move;
    switch(difficulty) {
        case 'easy':
            move = getRandomMove();
            break;
        case 'medium':
            move = getMediumMove();
            break;
        case 'hard':
            move = getHardMove();
            break;
        default:
            move = getRandomMove();
    }
    
    if (move !== -1) {
        const position = positionMap[move];
        
        // Log computer move to terminal
        addTerminalLine(`Computer (X) moves to ${position}`, true);
        
        boxes[move].innerText = "X";
        boxes[move].disabled = true;
        turnO = true;
        count++;
        
        updateTurnMessage();
        
        let isWinner = checkWinner();
        if(count === 9 && !isWinner){
            showDraw();
        }
    }
}

function getRandomMove() {
    let availableMoves = [];
    boxes.forEach((box, index) => {
        if (!box.disabled) {
            availableMoves.push(index);
        }
    });
    
    if (availableMoves.length > 0) {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    return -1;
}

function getMediumMove() {
    // 50% chance to play optimally, 50% random
    if (Math.random() < 0.5) {
        return getHardMove();
    }
    return getRandomMove();
}

function getHardMove() {
    // Check if computer can win
    let winMove = findWinningMove('X');
    if (winMove !== -1) return winMove;
    
    // Check if need to block player
    let blockMove = findWinningMove('O');
    if (blockMove !== -1) return blockMove;
    
    // Take center if available
    if (!boxes[4].disabled) return 4;
    
    // Take corners
    let corners = [0, 2, 6, 8];
    for (let corner of corners) {
        if (!boxes[corner].disabled) return corner;
    }
    
    // Take any available move
    return getRandomMove();
}

function findWinningMove(player) {
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        let values = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];
        
        // Check if two positions have the player's symbol and one is empty
        if (values.filter(v => v === player).length === 2 && values.filter(v => v === '').length === 1) {
            if (boxes[a].innerText === '') return a;
            if (boxes[b].innerText === '') return b;
            if (boxes[c].innerText === '') return c;
        }
    }
    return -1;
}


const disableBoxes = () => {
    for(let box of boxes) {
        box.disabled = true;
    }
}

const showWinner = (winner) => {
    gameActive = false;
    let winnerMessage;
    let terminalCommand;
    
    if (gameMode === 'pvc' && winner === 'X') {
        winnerMessage = `Computer Wins!`;
        terminalCommand = `game-result --winner=computer --mode=pvc`;
    } else if (gameMode === 'pvc' && winner === 'O') {
        winnerMessage = `You Win! Congratulations!`;
        terminalCommand = `game-result --winner=player --mode=pvc`;
    } else {
        winnerMessage = `Congratulations, Winner is "${winner}"`;
        terminalCommand = `game-result --winner=${winner} --mode=pvp`;
    }
    
    // Show terminal command simulation
    if (window.terminalApp) {
        window.terminalApp.simulateCommand(
            terminalCommand,
            () => {
                winMsg.innerText = winnerMessage;
                disableBoxes();
                winMsg.classList.remove("hide");
                newGameBtn.classList.remove("hide");
                
                // Add to terminal history
                window.terminalApp.addToHistory(
                    `tic-tac-toe game completed`,
                    winnerMessage,
                    'success'
                );
            },
            600
        );
    } else {
        // Fallback without terminal simulation
        winMsg.innerText = winnerMessage;
        disableBoxes();
        winMsg.classList.remove("hide");
        newGameBtn.classList.remove("hide");
    }
};

const showDraw = () => {
    gameActive = false;
    const drawMessage = `Game is Draw`;
    
    // Show terminal command simulation
    if (window.terminalApp) {
        window.terminalApp.simulateCommand(
            `game-result --status=draw --mode=${gameMode}`,
            () => {
                winMsg.innerText = drawMessage;
                disableBoxes();
                winMsg.classList.remove("hide");
                newGameBtn.classList.remove("hide");
                
                // Add to terminal history
                window.terminalApp.addToHistory(
                    `tic-tac-toe game completed`,
                    drawMessage,
                    'info'
                );
            },
            600
        );
    } else {
        // Fallback without terminal simulation
        winMsg.innerText = drawMessage;
        disableBoxes();
        winMsg.classList.remove("hide");
        newGameBtn.classList.remove("hide");
    }
}




const checkWinner = () => {
    for(let pattern of winPatterns){                            //here we will index each winning patter
        // console.log(pattern);
        // console.log((boxes[pattern[0]]),
        // console.log(boxes[pattern[0]]),
        // console.log(boxes[pattern[0]]),
        // );
        let pos1Val = boxes[pattern[0]].innerText;              //here we will index value of each element of every wining pattern one by one
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if(pos1Val != "" && pos2Val != "" && pos3Val != "") {
            if(pos1Val === pos2Val && pos2Val === pos3Val) {
                // console.log("winner",pos1Val);
                showWinner(pos1Val);
                return true;
            };
        };
    };
};

// Initialize game
function initializeGame() {
    // Initialize terminal framework
    if (typeof TerminalFramework !== 'undefined') {
        window.terminalApp = new TerminalFramework();
    }
    
    // Set default mode to PvP
    gameMode = 'pvp';
    difficulty = 'medium';
    pvpModeBtn.classList.add('active');
    difficultySection.classList.add('hide');
    updateDifficultyButtons();
    resetGame();
}

// Start the game when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}
