class Stopwatch {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.lapCount = 0;
        
        this.initializeElements();
        this.bindEvents();
        this.initializeTerminal();
    }
    
    // Terminal Integration Methods
    getCurrentCursorLine() {
        return document.querySelector('.line:last-child .cursor');
    }

    updateTerminalCursor(value) {
        const cursorLine = this.getCurrentCursorLine();
        if (cursorLine) {
            cursorLine.textContent = value + '_';
        }
    }

    addTerminalLine(content, isCommand = false) {
        const terminalOutput = document.querySelector('.terminal-output');
        if (!terminalOutput) return;
        
        const line = document.createElement('div');
        line.className = 'line';
        
        if (isCommand) {
            line.innerHTML = `<span class="prompt">user@stopwatch:~$</span> <span class="command">${content}</span>`;
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

    processTerminalCommand(command) {
        const cmd = command.toLowerCase().trim();
        
        switch(cmd) {
            case 'start':
                this.start();
                return null;
            case 'stop':
            case 'pause':
                this.pause();
                return null;
            case 'reset':
                this.reset();
                return null;
            case 'lap':
                this.recordLap();
                return null;
            case 'status':
                return this.isRunning ? 'Stopwatch is running' : 'Stopwatch is stopped';
            case 'time':
                return this.getCurrentTimeString();
            default:
                return `Unknown command: ${command}. Type 'help' for available commands.`;
        }
    }
    
    getHelpText() {
        return `Stopwatch Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏱️  STOPWATCH CONTROLS:
  start                  → Start the stopwatch
  stop, pause            → Pause the stopwatch
  reset                  → Reset to 00:00.00
  lap                    → Record a lap time

📊 STATUS & INFO:
  status                 → Check if running or stopped
  time                   → Show current elapsed time

🖥️  SYSTEM:
  help                   → Show this help message

💡 KEYBOARD SHORTCUTS:
  Space                  → Start/Stop toggle
  L                      → Record lap
  Ctrl+R                 → Reset

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    }
    
    processTerminalCommand(command) {
        const cmd = command.toLowerCase().trim();
        
        switch(cmd) {
            case 'start':
                this.start();
                return null;
            case 'stop':
            case 'pause':
                this.pause();
                return null;
            case 'reset':
                this.reset();
                return null;
            case 'lap':
                this.recordLap();
                return null;
            case 'status':
                return this.isRunning ? 'Stopwatch is running' : 'Stopwatch is stopped';
            case 'time':
                return this.getCurrentTimeString();
            case 'help':
                return this.getHelpText();
            default:
                return `Unknown command: ${command}. Type 'help' for available commands.`;
        }
    }

    getCurrentTimeString() {
        const minutes = Math.floor(this.elapsedTime / 60000);
        const seconds = Math.floor((this.elapsedTime % 60000) / 1000);
        const milliseconds = Math.floor((this.elapsedTime % 1000) / 10);
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }

    initializeTerminal() {
        this.updateTerminalCursor('');
        
        // Global keyboard handler
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            const cursorLine = this.getCurrentCursorLine();
            if (!cursorLine) return;
            
            if (e.key === 'Enter') {
                const command = cursorLine.textContent.replace('_', '').trim();
                
                if (command) {
                    this.addTerminalLine(command, true);
                    const result = this.processTerminalCommand(command);
                    if (result) {
                        this.addTerminalLine(result);
                    }
                    this.updateTerminalCursor('');
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
    }
    
    initializeElements() {
        this.timeDisplay = document.getElementById('timeDisplay');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapBtn = document.getElementById('lapBtn');
        this.lapsContainer = document.getElementById('lapsContainer');
        
        this.minutesSpan = this.timeDisplay.querySelector('.minutes');
        this.secondsSpan = this.timeDisplay.querySelector('.seconds');
        this.millisecondsSpan = this.timeDisplay.querySelector('.milliseconds');
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => {
            this.addTerminalLine('start', true);
            this.start();
        });
        this.pauseBtn.addEventListener('click', () => {
            this.addTerminalLine('stop', true);
            this.pause();
        });
        this.resetBtn.addEventListener('click', () => {
            this.addTerminalLine('reset', true);
            this.reset();
        });
        this.lapBtn.addEventListener('click', () => {
            this.addTerminalLine('lap', true);
            this.recordLap();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;
            
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    if (this.isRunning) {
                        this.pause();
                    } else {
                        this.start();
                    }
                    break;
                case 'KeyR':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.reset();
                    }
                    break;
                case 'KeyL':
                    if (this.isRunning) {
                        e.preventDefault();
                        this.recordLap();
                    }
                    break;
            }
        });
    }
    
    start() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.timerInterval = setInterval(() => this.updateDisplay(), 10);
            this.isRunning = true;
            
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.lapBtn.disabled = false;
            
            this.timeDisplay.classList.add('running');
            
            // Log to terminal
            this.addTerminalLine('Stopwatch started');
        }
    }
    
    pause() {
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.isRunning = false;
            
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.lapBtn.disabled = true;
            
            this.timeDisplay.classList.remove('running');
            
            // Log to terminal
            this.addTerminalLine('Stopwatch paused');
        }
    }
    
    reset() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.elapsedTime = 0;
        this.lapCount = 0;
        this.startTime = 0;
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.lapBtn.disabled = true;
        
        this.timeDisplay.classList.remove('running');
        
        // Manually set display to 00:00.00 instead of calling updateDisplay()
        this.minutesSpan.textContent = '00';
        this.secondsSpan.textContent = '00';
        this.millisecondsSpan.textContent = '00';
        
        this.clearLaps();
        
        // Log to terminal
        this.addTerminalLine('Stopwatch reset to 00:00.00');
    }
    
    updateDisplay() {
        this.elapsedTime = Date.now() - this.startTime;
        
        const totalMilliseconds = Math.floor(this.elapsedTime / 10);
        const minutes = Math.floor(totalMilliseconds / 6000);
        const seconds = Math.floor((totalMilliseconds % 6000) / 100);
        const milliseconds = totalMilliseconds % 100;
        
        this.minutesSpan.textContent = minutes.toString().padStart(2, '0');
        this.secondsSpan.textContent = seconds.toString().padStart(2, '0');
        this.millisecondsSpan.textContent = milliseconds.toString().padStart(2, '0');
    }
    
    recordLap() {
        if (this.isRunning) {
            this.lapCount++;
            const currentTime = this.formatTime(this.elapsedTime);
            
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            lapItem.innerHTML = `
                <span class="lap-number">LAP ${this.lapCount}</span>
                <span class="lap-time">${currentTime}</span>
            `;
            
            // Remove "no laps" message if it exists
            const noLaps = this.lapsContainer.querySelector('.no-laps');
            if (noLaps) {
                noLaps.remove();
            }
            
            // Add new lap at the top
            this.lapsContainer.insertBefore(lapItem, this.lapsContainer.firstChild);
            
            // Add animation
            lapItem.style.opacity = '0';
            lapItem.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                lapItem.style.transition = 'all 0.3s ease';
                lapItem.style.opacity = '1';
                lapItem.style.transform = 'translateY(0)';
            }, 10);
            
            // Log to terminal
            this.addTerminalLine(`Lap ${this.lapCount} recorded: ${currentTime}`);
        }
    }
    
    clearLaps() {
        this.lapsContainer.innerHTML = '<div class="no-laps">No lap times recorded</div>';
    }
    
    formatTime(milliseconds) {
        const totalMs = Math.floor(milliseconds / 10);
        const minutes = Math.floor(totalMs / 6000);
        const seconds = Math.floor((totalMs % 6000) / 100);
        const ms = totalMs % 100;
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    }
    
}

// Initialize stopwatch when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Stopwatch();
    
    // Add keyboard shortcuts info to the page
    const shortcutsInfo = document.createElement('div');
    shortcutsInfo.className = 'shortcuts-info';
    shortcutsInfo.innerHTML = `
        <p><strong>Keyboard Shortcuts:</strong></p>
        <p>SPACE - Start/Pause | L - Lap | Ctrl+R - Reset</p>
    `;
    shortcutsInfo.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        padding: var(--spacing-sm);
        font-family: 'Courier New', monospace;
        font-size: 0.8rem;
        color: var(--text-secondary);
        opacity: 0.8;
        z-index: 100;
    `;
    
    document.body.appendChild(shortcutsInfo);
});