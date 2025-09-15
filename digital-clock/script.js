// Digital Clock with Terminal Integration
class DigitalClock {
    constructor() {
        this.is24Hour = true;
        this.showSeconds = true;
        this.updateInterval = null;
        
        this.init();
    }

    init() {
        this.setupElements();
        this.initializeTerminal();
        this.startClock();
        
        // Initialize terminal messages
        TerminalMessages.init();
        TerminalMessages.startClock();
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
            line.innerHTML = `<span class="prompt">user@digital-clock:~$</span> <span class="command">${content}</span>`;
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
        
        // Limit terminal messages to 6-7 lines
        this.limitTerminalMessages();
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    limitTerminalMessages() {
        const terminalOutput = document.querySelector('.terminal-output');
        if (!terminalOutput) return;
        
        const lines = terminalOutput.querySelectorAll('.line');
        const maxLines = 6; // Keep 6 lines + cursor line = 7 total
        
        if (lines.length > maxLines + 1) { // +1 for cursor line
            // Remove oldest lines (keep cursor line at the end)
            const linesToRemove = lines.length - maxLines - 1;
            for (let i = 0; i < linesToRemove; i++) {
                if (lines[i] && !lines[i].innerHTML.includes('cursor')) {
                    lines[i].remove();
                }
            }
        }
    }

    processTerminalCommand(command) {
        const cmd = command.toLowerCase().trim();
        const parts = cmd.split(' ');
        
        // Print numbers command
        if (parts[0] === 'print' && parts[1]) {
            const number = parseInt(parts[1]);
            if (!isNaN(number) && number >= 0 && number <= 9) {
                this.printNumber(number);
                return `Number ${number} printed`;
            } else {
                return 'Please enter a number between 0-9';
            }
        }
        
        // Format commands
        if (parts[0] === 'format' && parts[1]) {
            if (parts[1] === '12h' || parts[1] === '12') {
                this.setFormat(false);
                return 'Switched to 12-hour format';
            } else if (parts[1] === '24h' || parts[1] === '24') {
                this.setFormat(true);
                return 'Switched to 24-hour format';
            } else {
                return 'Available formats: 12h, 24h';
            }
        }
        
        // Toggle commands
        if (parts[0] === 'toggle' && parts[1]) {
            if (parts[1] === 'seconds') {
                this.toggleSeconds();
                return `Seconds ${this.showSeconds ? 'enabled' : 'disabled'}`;
            } else {
                return 'Available toggles: seconds';
            }
        }
        
        // System commands
        const systemCommands = {
            'time': () => this.getCurrentTime(),
            'help': () => `Commands: print [0-9], format [12h|24h], toggle seconds, time, help`,
            'status': () => `Format: ${this.is24Hour ? '24h' : '12h'}, Seconds: ${this.showSeconds ? 'on' : 'off'}`
        };
        
        if (systemCommands[cmd]) {
            return systemCommands[cmd]();
        }
        
        return `Unknown command: ${command}. Type 'help' for available commands.`;
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

    setupElements() {
        this.elements = {
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            dateDisplay: document.getElementById('date-display'),
            timezoneDisplay: document.getElementById('timezone-display')
        };
    }

    printNumber(number) {
        // Create a visual effect for printing numbers
        const timeDisplay = document.querySelector('.time-display');
        const printEffect = document.createElement('div');
        printEffect.className = 'print-effect';
        printEffect.textContent = number;
        printEffect.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 4rem;
            color: var(--accent-color);
            font-weight: bold;
            z-index: 1000;
            animation: printNumber 2s ease-out forwards;
            pointer-events: none;
        `;
        
        // Add animation keyframes if not already added
        if (!document.querySelector('#print-animation')) {
            const style = document.createElement('style');
            style.id = 'print-animation';
            style.textContent = `
                @keyframes printNumber {
                    0% { 
                        opacity: 0; 
                        transform: translate(-50%, -50%) scale(0.5);
                    }
                    50% { 
                        opacity: 1; 
                        transform: translate(-50%, -50%) scale(1.2);
                    }
                    100% { 
                        opacity: 0; 
                        transform: translate(-50%, -50%) scale(1);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        timeDisplay.appendChild(printEffect);
        
        // Remove effect after animation
        setTimeout(() => {
            if (printEffect.parentNode) {
                printEffect.parentNode.removeChild(printEffect);
            }
        }, 2000);
    }

    setFormat(is24Hour) {
        this.is24Hour = is24Hour;
        this.updateClock();
    }

    toggleSeconds() {
        this.showSeconds = !this.showSeconds;
        this.updateClock();
    }

    getCurrentTime() {
        const now = new Date();
        if (this.is24Hour) {
            return now.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: this.showSeconds ? '2-digit' : undefined 
            });
        } else {
            return now.toLocaleTimeString('en-US', { 
                hour12: true, 
                hour: 'numeric', 
                minute: '2-digit', 
                second: this.showSeconds ? '2-digit' : undefined 
            });
        }
    }

    startClock() {
        this.updateClock();
        this.updateInterval = setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();
        
        // Update time
        let hours, minutes, seconds;
        
        if (this.is24Hour) {
            hours = String(now.getHours()).padStart(2, '0');
            minutes = String(now.getMinutes()).padStart(2, '0');
            seconds = String(now.getSeconds()).padStart(2, '0');
        } else {
            const time12 = now.toLocaleTimeString('en-US', { 
                hour12: true, 
                hour: 'numeric', 
                minute: '2-digit', 
                second: '2-digit' 
            });
            const [time, ampm] = time12.split(' ');
            const [h, m, s] = time.split(':');
            hours = String(parseInt(h)).padStart(2, '0');
            minutes = m;
            seconds = s;
        }
        
        this.elements.hours.textContent = hours;
        this.elements.minutes.textContent = minutes;
        this.elements.seconds.textContent = seconds;
        
        // Hide seconds if disabled
        this.elements.seconds.style.display = this.showSeconds ? 'inline-block' : 'none';
        
        // Update date
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const dateStr = now.toLocaleDateString('en-US', options);
        this.elements.dateDisplay.textContent = dateStr;
        
        // Update timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.elements.timezoneDisplay.textContent = timezone;
    }
}

// Initialize clock when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DigitalClock();
});