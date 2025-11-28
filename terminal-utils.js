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

// Read-Only Terminal System
class TerminalUI {
    constructor(appName) {
        this.appName = appName;
        this.terminalOutput = document.querySelector('.terminal-output');
        this.maxLogs = 5; // Strict limit: 5 logs
        this.prompt = 'ubednama@alamgirr.local:~ $';

        this.init();
    }

    init() {
        this.renderInitialState();
    }

    // Log an action from the App UI to the Terminal
    log(message, type = 'info') {
        this.addEntry(message, type);
    }

    addEntry(content, type) {
        // Create new line
        const line = document.createElement('div');
        line.className = 'line';

        let icon = '';
        if (type === 'success') icon = '✓';
        if (type === 'error') icon = '✗';
        if (type === 'warning') icon = '⚠';

        // Format: prompt command (or message)
        // For read-only, we'll simulate the prompt for every line or just show the message?
        // User asked for "ubednama@alamgirr.local:~ $"
        // Let's format it as: Prompt Message [Icon]

        const promptSpan = `<span class="prompt-text">${this.prompt}</span>`;
        const messageSpan = `<span class="message ${type}">${content}</span>`;
        const iconSpan = icon ? `<span class="icon ${type}">${icon}</span>` : '';

        line.innerHTML = `${promptSpan} ${messageSpan} ${iconSpan}`;

        // Append to output
        this.terminalOutput.appendChild(line);

        this.enforceLogLimit();
        this.scrollToBottom();
    }

    enforceLogLimit() {
        const lines = Array.from(this.terminalOutput.children);
        if (lines.length > this.maxLogs) {
            // Remove oldest logs
            const removeCount = lines.length - this.maxLogs;
            for (let i = 0; i < removeCount; i++) {
                if (lines[i]) lines[i].remove();
            }
        }
    }

    scrollToBottom() {
        this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
    }

    renderInitialState() {
        // Clear existing content
        this.terminalOutput.innerHTML = '';
        // Initial log
        this.log(`${this.appName} initialized...`, 'system');
    }
}

// Export for use
window.TerminalUtils = {
    TerminalClock,
    TerminalUI
};

// Initialize Clock on load
document.addEventListener('DOMContentLoaded', () => {
    new TerminalClock();
});