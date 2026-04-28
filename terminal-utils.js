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
            hour12: true,
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
        const line = document.createElement('div');
        line.className = 'line';

        const iconChar = type === 'success' ? '✓' : type === 'error' ? '✗' : type === 'warning' ? '⚠' : '';

        const promptSpan = document.createElement('span');
        promptSpan.className = 'prompt-text';
        promptSpan.textContent = this.prompt;

        const messageSpan = document.createElement('span');
        messageSpan.className = `message ${type}`;
        messageSpan.textContent = content;

        line.append(promptSpan, document.createTextNode(' '), messageSpan);

        if (iconChar) {
            const iconSpan = document.createElement('span');
            iconSpan.className = `icon ${type}`;
            iconSpan.textContent = iconChar;
            line.append(document.createTextNode(' '), iconSpan);
        }

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
// Shared Utilities
const Utils = {
    copyToClipboard: async (text, onSuccess, onError) => {
        try {
            await navigator.clipboard.writeText(text);
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error('Clipboard Error:', err);
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textArea);
                if (onSuccess) onSuccess();
            } catch (fallbackErr) {
                console.error('Fallback Clipboard Error:', fallbackErr);
                if (onError) onError(fallbackErr);
            }
        }
    },

    onEnter: (inputEl, handler) => {
        if (!inputEl) return;
        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handler(e);
            }
        });
    },

    showToast: (message, type = 'info') => {
        let container = document.getElementById('toast-container');
        if (!container) {
            // Create if missing (fallback)
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerText = message;
        container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            toast.classList.add('fade-out');
            toast.addEventListener('animationend', () => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            });
        }, 3000);
    }
};

// Export for use
window.TerminalUtils = {
    TerminalClock,
    TerminalUI,
    ...Utils
};

// Initialize Clock on load
document.addEventListener('DOMContentLoaded', () => {
    new TerminalClock();
});