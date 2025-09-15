//game.js
let userScore = 0;
let compScore = 0;
let difficulty = 'medium';
let userHistory = [];
let gameCount = 0;

const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");
const compScoreText = document.querySelector("#compScore");
const userScoreText = document.querySelector("#userScore");

// Difficulty buttons
const easyModeBtn = document.querySelector("#easy-mode");
const mediumModeBtn = document.querySelector("#medium-mode");
const hardModeBtn = document.querySelector("#hard-mode");

const genCompChoice = () => {
    const options = ["rock", "paper", "scissors"];
    
    switch(difficulty) {
        case 'easy':
            return getEasyChoice();
        case 'medium':
            return getMediumChoice();
        case 'hard':
            return getHardChoice();
        default:
            return options[Math.floor(Math.random() * 3)];
    }
};

function getEasyChoice() {
    const options = ["rock", "paper", "scissors"];
    return options[Math.floor(Math.random() * 3)];
}

function getMediumChoice() {
    const options = ["rock", "paper", "scissors"];
    
    // 70% random, 30% counter user's most frequent choice
    if (Math.random() < 0.7 || userHistory.length < 3) {
        return options[Math.floor(Math.random() * 3)];
    }
    
    // Find user's most frequent choice and counter it
    const mostFrequent = getMostFrequentChoice();
    return getCounterChoice(mostFrequent);
}

function getHardChoice() {
    const options = ["rock", "paper", "scissors"];
    
    if (userHistory.length < 2) {
        return options[Math.floor(Math.random() * 3)];
    }
    
    // Analyze patterns in user's last few moves
    if (userHistory.length >= 3) {
        const lastThree = userHistory.slice(-3);
        
        // Check for patterns
        if (lastThree[0] === lastThree[1] && lastThree[1] === lastThree[2]) {
            // User is repeating the same choice
            return getCounterChoice(lastThree[2]);
        }
        
        // Check for alternating pattern
        if (lastThree[0] === lastThree[2] && lastThree[0] !== lastThree[1]) {
            // Predict user will continue alternating
            return getCounterChoice(lastThree[0]);
        }
    }
    
    // 60% counter most frequent, 40% random
    if (Math.random() < 0.6) {
        const mostFrequent = getMostFrequentChoice();
        return getCounterChoice(mostFrequent);
    }
    
    return options[Math.floor(Math.random() * 3)];
}

function getMostFrequentChoice() {
    if (userHistory.length === 0) return "rock";
    
    const counts = { rock: 0, paper: 0, scissors: 0 };
    userHistory.forEach(choice => counts[choice]++);
    
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
}

function getCounterChoice(userChoice) {
    const counters = {
        rock: "paper",
        paper: "scissors",
        scissors: "rock"
    };
    return counters[userChoice];
}

const showWinner = (userWin,userChoice, compChoice) =>{
    if (userWin) {
        userScore++;
        msg.innerText = `You Won❤️!! your ${userChoice} beats ${compChoice}`;
        msg.style.backgroundColor = "green";
        userScoreText.innerText = userScore;
        
        // Add terminal message
        if (typeof TerminalMessages !== 'undefined') {
            TerminalMessages.addMessage(`<span class="prompt">user@rps:~$</span> <span class="command success">Victory! ${userChoice} defeats ${compChoice} ✓</span>`);
        }
    }
    else {
        compScore++;
        msg.innerText = `You Lost🤣 ${compChoice} beats your ${userChoice}`;
        msg.style.backgroundColor = "red";
        compScoreText.innerText = compScore;
        
        // Add terminal message
        if (typeof TerminalMessages !== 'undefined') {
            TerminalMessages.addMessage(`<span class="prompt">user@rps:~$</span> <span class="command error">Defeat! ${compChoice} defeats ${userChoice} ✗</span>`);
        }
    }
}

const drawGame = () => {
    msg.innerText = "Draw... Play again";
    msg.style.backgroundColor = "#14110F";
    
    // Add terminal message
    if (typeof TerminalMessages !== 'undefined') {
        TerminalMessages.addMessage(`<span class="prompt">user@rps:~$</span> <span class="command">Draw! Both chose same option - try again</span>`);
    }
}

// Terminal Integration Variables
let isInteractingWithApp = false;
let currentInput = '';
const validChoices = ['rock', 'paper', 'scissors', 'r', 'p', 's'];

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
        line.innerHTML = `<span class="prompt">user@rps-game:~$</span> <span class="command">${content}</span>`;
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

// Tab completion for RPS choices
function getTabCompletion(input) {
    const matches = validChoices.filter(choice => choice.startsWith(input.toLowerCase()));
    if (matches.length === 1) {
        return matches[0];
    } else if (matches.length > 1) {
        return matches; // Return all matches for display
    }
    return null;
}

// Enhanced Terminal Commander for RPS
class RPSTerminal {
    static processCommand(command) {
        const cmd = command.toLowerCase().trim();
        
        // RPS-specific commands
        if (validChoices.includes(cmd)) {
            const choice = cmd === 'r' ? 'rock' : cmd === 'p' ? 'paper' : cmd === 's' ? 'scissors' : cmd;
            playGame(choice);
            return null;
        }
        
        // System commands
        const systemCommands = {
            'whoami': 'ubednama',
            'pwd': '/home/ubednama/rock-paper-scissors',
            'date': new Date().toString(),
            'uptime': '15:25:22 up 2:15, 1 user, load average: 0.15, 0.10, 0.05',
            'uname -a': 'Linux rps-terminal 5.15.0-rps #1 SMP x86_64 GNU/Linux'
        };
        
        if (systemCommands[cmd]) {
            return systemCommands[cmd];
        }
        
        // App navigation
        const apps = {
            'calculator': '../calculator/',
            'weather': '../weather-app/',
            'dictionary': '../dictionary-app/',
            'home': '../index.html'
        };
        
        if (apps[cmd]) {
            window.location.href = apps[cmd];
            return null;
        }
        
        if (cmd.startsWith('echo ')) {
            return command.substring(5);
        }
        
        if (cmd === 'clear') {
            this.clearTerminal();
            return null;
        }
        
        return `bash: ${command}: command not found. Try: rock, paper, scissors (or r, p, s)`;
    }
    
    static clearTerminal() {
        const terminalOutput = document.querySelector('.terminal-output');
        if (terminalOutput) {
            const lines = terminalOutput.querySelectorAll('.line');
            for (let i = 5; i < lines.length - 1; i++) {
                if (lines[i] && !lines[i].querySelector('.game-setup, .game')) {
                    lines[i].remove();
                }
            }
        }
    }
}

// Global keyboard handler for unified terminal
document.addEventListener('keydown', (e) => {
    // Don't interfere with input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    const cursorLine = getCurrentCursorLine();
    if (!cursorLine) return;
    
    if (e.key === 'Enter') {
        const command = cursorLine.textContent.replace('_', '').trim();
        
        if (command) {
            // Process RPS command
            addTerminalLine(command, true);
            const result = RPSTerminal.processCommand(command);
            if (result) {
                addTerminalLine(result);
            }
            updateTerminalCursor('');
            currentInput = '';
        }
        e.preventDefault();
    } else if (e.key === 'Tab') {
        // Tab completion
        const currentText = cursorLine.textContent.replace('_', '');
        const completion = getTabCompletion(currentText);
        
        if (typeof completion === 'string') {
            // Single match - complete it
            cursorLine.textContent = completion + '_';
            currentInput = completion;
        } else if (Array.isArray(completion)) {
            // Multiple matches - show them
            addTerminalLine(`Available choices: ${completion.join(', ')}`);
        }
        e.preventDefault();
    } else if (e.key === 'Backspace') {
        const currentText = cursorLine.textContent.replace('_', '');
        const newText = currentText.slice(0, -1);
        cursorLine.textContent = newText + '_';
        currentInput = newText;
        e.preventDefault();
    } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        // Normal typing
        const currentText = cursorLine.textContent.replace('_', '');
        const newText = currentText + e.key;
        cursorLine.textContent = newText + '_';
        currentInput = newText;
        e.preventDefault();
    }
});

// Initialize game
function initializeGame() {
    difficulty = 'medium';
    updateDifficultyButtons();
    resetGame();
    updateTerminalCursor('');
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});


//main game
const playGame = (userChoice) => {
    
    // Track user's choice for AI learning
    userHistory.push(userChoice);
    gameCount++;
    
    // Keep only last 10 moves for pattern analysis
    if (userHistory.length > 10) {
        userHistory.shift();
    }
    
    //Generate comp Choice
    const compChoice = genCompChoice();

    if(userChoice === compChoice) {
        //Draw Game
        drawGame();
    }
    else {
        let userWin = true;
        if(userChoice === 'rock') {
            userWin = compChoice === "paper" ? false: true;
        }
        else if (userChoice === "paper") {
            userWin = compChoice === "scissors" ? false : true;
        }
        else {
            userWin = compChoice === "rock" ? false : true;
        }
        showWinner(userWin, userChoice, compChoice);
    }
};

// Difficulty selection event listeners
easyModeBtn.addEventListener("click", () => {
    difficulty = 'easy';
    addTerminalLine('difficulty easy', true);
    addTerminalLine('Difficulty set to Easy mode');
    updateDifficultyButtons();
    resetGame();
});

mediumModeBtn.addEventListener("click", () => {
    difficulty = 'medium';
    addTerminalLine('difficulty medium', true);
    addTerminalLine('Difficulty set to Medium mode');
    updateDifficultyButtons();
    resetGame();
});

hardModeBtn.addEventListener("click", () => {
    difficulty = 'hard';
    addTerminalLine('difficulty hard', true);
    addTerminalLine('Difficulty set to Hard mode');
    updateDifficultyButtons();
    resetGame();
});

function updateDifficultyButtons() {
    document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
    if (difficulty === 'easy') easyModeBtn.classList.add('active');
    else if (difficulty === 'medium') mediumModeBtn.classList.add('active');
    else if (difficulty === 'hard') hardModeBtn.classList.add('active');
}

function resetGame() {
    userScore = 0;
    compScore = 0;
    userHistory = [];
    gameCount = 0;
    userScoreText.innerText = userScore;
    compScoreText.innerText = compScore;
    msg.innerText = `Play your Move (${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Mode)`;
    msg.style.backgroundColor = "#14110F";
}

choices.forEach((choice) => {
    choice.addEventListener("click", () =>{
        const userChoice = choice.getAttribute('id');
        // Log the equivalent terminal command
        addTerminalLine(userChoice, true);
        playGame(userChoice);
    });
});
    