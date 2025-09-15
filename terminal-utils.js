// Universal Terminal Utilities for all applications

// Terminal Clock Manager
class TerminalClock {
    constructor() {
        this.init();
    }

    init() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        let clockElements = document.querySelectorAll('#currentTime, .status-clock');
        
        // If no clock element exists, create one
        if (clockElements.length === 0) {
            const statusBar = document.querySelector('.status-bar');
            if (statusBar) {
                const clockElement = document.createElement('span');
                clockElement.className = 'status-item status-clock';
                clockElement.id = 'currentTime';
                statusBar.appendChild(clockElement);
                clockElements = [clockElement];
            }
        }

        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        clockElements.forEach(element => {
            if (element) {
                element.textContent = `🕐 ${timeString}`;
            }
        });
    }
}

// Terminal Message System (replaces toast notifications)
class TerminalMessages {
    static addMessage(message, type = 'output') {
        const terminalOutput = document.querySelector('.terminal-output');
        if (terminalOutput) {
            const line = document.createElement('div');
            line.className = `line output ${type}`;
            line.innerHTML = message;
            
            // Find the cursor line and insert before it
            const cursorLine = terminalOutput.querySelector('.line:last-child');
            if (cursorLine && cursorLine.innerHTML.includes('cursor')) {
                terminalOutput.insertBefore(line, cursorLine);
            } else {
                terminalOutput.appendChild(line);
            }
            
            // Limit terminal messages (keep only recent ones for non-index pages)
            this.limitTerminalMessages();
            
            // Scroll to bottom
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    }

    static limitTerminalMessages() {
        // Don't limit on index page
        if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
            return;
        }

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

    static addSuccess(message) {
        this.addMessage(message + ' ✓', 'success');
    }

    static addError(message) {
        this.addMessage(message + ' ✗', 'error');
    }

    static addWarning(message) {
        this.addMessage(message + ' ⚠', 'warning');
    }
}

// Terminal Button Manager
class TerminalButtonManager {
    static initializeButtons(selector = '.terminal-btn, .mode-btn, .difficulty-btn, .terminal-option') {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach(button => {
            // Ensure terminal styling
            if (!button.classList.contains('terminal-btn')) {
                button.classList.add('terminal-btn');
            }
        });
    }

    static handleSingleSelection(buttons, activeButton) {
        buttons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }
}

// Terminal Theme Notifier
class TerminalThemeNotifier {
    static notifyThemeChange(theme) {
        TerminalMessages.addSuccess(`Theme switched to ${theme} mode`);
    }
}

// Interactive Terminal Commander
class TerminalCommander {
    static processCommand(command, appName) {
        const cmd = command.toLowerCase().trim();
        
        // System commands
        if (cmd === 'whoami') {
            return 'ubednama';
        } else if (cmd === 'pwd') {
            return `/home/ubednama/${appName}`;
        } else if (cmd === 'date') {
            return new Date().toString();
        } else if (cmd === 'uptime') {
            const uptime = Math.floor(Math.random() * 100) + 1;
            return `up ${uptime} minutes, 1 user, load average: 0.15, 0.10, 0.05`;
        } else if (cmd === 'uname -a') {
            return 'Linux terminal 5.15.0 #1 SMP x86_64 GNU/Linux';
        } else if (cmd === 'ls') {
            return 'README.md  index.html  script.js  style.css';
        } else if (cmd === 'clear') {
            this.clearTerminal();
            return null;
        } else if (cmd.startsWith('echo ')) {
            return command.substring(5);
        }
        
        // App navigation commands
        const apps = {
            'calculator': '../calculator/',
            'tic-tac-toe': '../tic-tac-toe/',
            'weather': '../weather-app/',
            'dictionary': '../dictionary-app/',
            'currency': '../currency-converter/',
            'temperature': '../temperature-converter/',
            'password': '../password-generator/',
            'qr': '../qr-code-generator/',
            'color': '../color-picker/',
            'stopwatch': '../stopwatch/',
            'clock': '../digital-clock/',
            'analog': '../analog-clock/',
            'circle': '../circle-game/',
            'rps': '../rock-paper-scissors/',
            'sign': '../quick-sign/',
            'numbers': '../print-numbers/',
            'quotes': '../bb-quotes-api/',
            'home': '../index.html'
        };
        
        if (apps[cmd]) {
            window.location.href = apps[cmd];
            return null;
        }
        
        return `Command not found: ${command}`;
    }

    static clearTerminal() {
        const terminalOutput = document.querySelector('.terminal-output');
        if (terminalOutput) {
            // Keep only the first few lines (initialization)
            const lines = terminalOutput.querySelectorAll('.line');
            for (let i = 3; i < lines.length - 1; i++) {
                lines[i].remove();
            }
        }
    }

    static getAppName() {
        const terminalTitle = document.querySelector('.terminal-title');
        if (terminalTitle) {
            const titleText = terminalTitle.textContent;
            if (titleText.includes('@')) {
                return titleText.split('@')[0];
            }
        }
        return 'terminal';
    }

    static initInteractiveTerminal() {
        const appName = this.getAppName();
        
        document.addEventListener('keydown', (e) => {
            // Only process if not typing in an input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                return;
            }
            
            const cursorLine = document.querySelector('.line:last-child .cursor');
            if (!cursorLine) return;
            
            if (e.key === 'Enter') {
                const command = cursorLine.textContent.replace('_', '').trim();
                if (command) {
                    // Add command line to terminal
                    TerminalMessages.addMessage(`<span class="prompt">user@${appName}:~$</span> <span class="command">${command}</span>`);
                    
                    const result = this.processCommand(command, appName);
                    if (result) {
                        TerminalMessages.addMessage(result);
                    }
                    // Clear the input
                    cursorLine.textContent = '_';
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
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize clock
    new TerminalClock();
    
    // Initialize button manager
    TerminalButtonManager.initializeButtons();
    
    // Don't initialize generic interactive terminal - apps handle their own
    // TerminalCommander.initInteractiveTerminal();
    
    // Override theme notification if theme manager exists
    if (window.themeManager && window.themeManager.showThemeNotification) {
        const originalShow = window.themeManager.showThemeNotification;
        window.themeManager.showThemeNotification = function() {
            TerminalThemeNotifier.notifyThemeChange(this.theme);
        };
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TerminalClock,
        TerminalMessages,
        TerminalButtonManager,
        TerminalThemeNotifier,
        TerminalCommander
    };
} else {
    window.TerminalUtils = {
        TerminalClock,
        TerminalMessages,
        TerminalButtonManager,
        TerminalThemeNotifier,
        TerminalCommander
    };
}