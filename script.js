// Terminal-style Mini Projects JavaScript
(function() {
    'use strict';

    // Theme Management
    class ThemeManager {
        constructor() {
            this.theme = localStorage.getItem('theme') || 'dark';
            this.init();
        }

        init() {
            this.applyTheme();
            this.bindEvents();
            this.updateToggleButton();
        }

        applyTheme() {
            document.documentElement.setAttribute('data-theme', this.theme);
            localStorage.setItem('theme', this.theme);
        }

        toggleTheme() {
            this.theme = this.theme === 'dark' ? 'light' : 'dark';
            this.applyTheme();
            this.updateToggleButton();
            this.showThemeNotification();
        }

        updateToggleButton() {
            const toggleBtn = document.querySelector('.theme-toggle');
            if (toggleBtn) {
                toggleBtn.textContent = this.theme === 'dark' ? '☀️' : '🌙';
                toggleBtn.setAttribute('aria-label', 
                    `Switch to ${this.theme === 'dark' ? 'light' : 'dark'} theme`);
            }
        }

        showThemeNotification() {
            const notification = document.createElement('div');
            notification.className = 'theme-notification';
            notification.textContent = `Switched to ${this.theme} theme`;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--bg-header);
                color: var(--text-primary);
                padding: 8px 16px;
                border: 1px solid var(--border-color);
                border-radius: 4px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 12px;
                z-index: 1000;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            // Animate in
            requestAnimationFrame(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(0)';
            });
            
            // Remove after 2 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 2000);
        }

        bindEvents() {
            const toggleBtn = document.querySelector('.theme-toggle');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => this.toggleTheme());
            }

            // Keyboard shortcut: Ctrl/Cmd + Shift + T
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }
    }

    // Terminal Animation Manager
    class TerminalAnimator {
        constructor() {
            this.init();
        }

        init() {
            this.animateTerminalOutput();
            this.setupCursor();
            this.setupProjectHovers();
        }

        animateTerminalOutput() {
            const lines = document.querySelectorAll('.terminal-output .line');
            lines.forEach((line, index) => {
                line.style.opacity = '0';
                line.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    line.style.transition = 'all 0.3s ease';
                    line.style.opacity = '1';
                    line.style.transform = 'translateX(0)';
                }, index * 100);
            });
        }

        setupCursor() {
            const cursor = document.querySelector('.cursor');
            if (cursor) {
                // Add typing effect
                let isTyping = false;
                
                document.addEventListener('keydown', () => {
                    if (!isTyping) {
                        isTyping = true;
                        cursor.style.animationDuration = '0.1s';
                        
                        setTimeout(() => {
                            cursor.style.animationDuration = '1s';
                            isTyping = false;
                        }, 1000);
                    }
                });
            }
        }

        setupProjectHovers() {
            const projectLinks = document.querySelectorAll('.project-link');
            
            projectLinks.forEach(link => {
                link.addEventListener('mouseenter', (e) => {
                    this.createHoverEffect(e.target);
                });
                
                link.addEventListener('mouseleave', (e) => {
                    this.removeHoverEffect(e.target);
                });
            });
        }

        createHoverEffect(element) {
            const effect = document.createElement('div');
            effect.className = 'hover-effect';
            effect.style.cssText = `
                position: absolute;
                left: 0;
                top: 0;
                width: 3px;
                height: 100%;
                background: var(--accent-color);
                opacity: 0;
                transition: opacity 0.2s ease;
                pointer-events: none;
            `;
            
            element.style.position = 'relative';
            element.appendChild(effect);
            
            requestAnimationFrame(() => {
                effect.style.opacity = '1';
            });
        }

        removeHoverEffect(element) {
            const effect = element.querySelector('.hover-effect');
            if (effect) {
                effect.style.opacity = '0';
                setTimeout(() => {
                    if (effect.parentNode) {
                        effect.parentNode.removeChild(effect);
                    }
                }, 200);
            }
        }
    }

    // Keyboard Navigation Manager
    class KeyboardManager {
        constructor() {
            this.currentFocus = -1;
            this.focusableElements = [];
            this.init();
        }

        init() {
            this.updateFocusableElements();
            this.bindEvents();
        }

        updateFocusableElements() {
            this.focusableElements = Array.from(document.querySelectorAll(
                '.project-link, .theme-toggle, .btn'
            ));
        }

        bindEvents() {
            document.addEventListener('keydown', (e) => {
                switch(e.key) {
                    case 'Tab':
                        if (e.shiftKey) {
                            this.focusPrevious(e);
                        } else {
                            this.focusNext(e);
                        }
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.focusNext();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        this.focusPrevious();
                        break;
                    case 'Enter':
                    case ' ':
                        if (document.activeElement && 
                            this.focusableElements.includes(document.activeElement)) {
                            e.preventDefault();
                            document.activeElement.click();
                        }
                        break;
                    case 'Home':
                        e.preventDefault();
                        this.focusFirst();
                        break;
                    case 'End':
                        e.preventDefault();
                        this.focusLast();
                        break;
                }
            });
        }

        focusNext(e) {
            if (e) e.preventDefault();
            this.currentFocus = (this.currentFocus + 1) % this.focusableElements.length;
            this.focusableElements[this.currentFocus].focus();
        }

        focusPrevious(e) {
            if (e) e.preventDefault();
            this.currentFocus = this.currentFocus <= 0 
                ? this.focusableElements.length - 1 
                : this.currentFocus - 1;
            this.focusableElements[this.currentFocus].focus();
        }

        focusFirst() {
            this.currentFocus = 0;
            this.focusableElements[this.currentFocus].focus();
        }

        focusLast() {
            this.currentFocus = this.focusableElements.length - 1;
            this.focusableElements[this.currentFocus].focus();
        }
    }

    // Terminal Window Controls
    class TerminalControls {
        constructor() {
            this.init();
        }

        init() {
            this.bindWindowControls();
        }

        bindWindowControls() {
            const closeBtn = document.querySelector('.btn.close');
            const minimizeBtn = document.querySelector('.btn.minimize');
            const maximizeBtn = document.querySelector('.btn.maximize');

            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.showCloseConfirmation();
                });
            }

            if (minimizeBtn) {
                minimizeBtn.addEventListener('click', () => {
                    this.minimizeWindow();
                });
            }

            if (maximizeBtn) {
                maximizeBtn.addEventListener('click', () => {
                    this.toggleMaximize();
                });
            }
        }

        showCloseConfirmation() {
            const confirmed = confirm('Are you sure you want to close the terminal?');
            if (confirmed) {
                // In a real terminal, this would close the window
                // For demo purposes, we'll just show a message
                this.showTerminalMessage('Terminal session ended. Refresh to restart.');
            }
        }

        minimizeWindow() {
            const container = document.querySelector('.terminal-container');
            container.style.transform = 'scale(0.8)';
            container.style.opacity = '0.5';
            
            setTimeout(() => {
                container.style.transform = 'scale(1)';
                container.style.opacity = '1';
            }, 1000);
        }

        toggleMaximize() {
            const container = document.querySelector('.terminal-container');
            const isMaximized = container.classList.contains('maximized');
            
            if (isMaximized) {
                container.classList.remove('maximized');
                container.style.cssText = '';
            } else {
                container.classList.add('maximized');
                container.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    margin: 0;
                    border-radius: 0;
                    z-index: 1000;
                `;
            }
        }

        showTerminalMessage(message) {
            const output = document.querySelector('.terminal-output');
            const newLine = document.createElement('div');
            newLine.className = 'line';
            newLine.innerHTML = `
                <span class="prompt">system@terminal:~$</span>
                <span class="output">${message}</span>
            `;
            output.appendChild(newLine);
        }
    }

    // Performance Monitor
    class PerformanceMonitor {
        constructor() {
            this.startTime = performance.now();
            this.init();
        }

        init() {
            this.updateStatus();
            setInterval(() => this.updateStatus(), 5000);
        }

        updateStatus() {
            const statusItems = document.querySelectorAll('.status-item');
            const uptime = Math.floor((performance.now() - this.startTime) / 1000);
            const memory = this.getMemoryUsage();
            
            statusItems.forEach(item => {
                const type = item.dataset.type;
                switch(type) {
                    case 'uptime':
                        item.textContent = `Uptime: ${this.formatTime(uptime)}`;
                        break;
                    case 'memory':
                        item.textContent = `Memory: ${memory}MB`;
                        break;
                    case 'projects':
                        const projectCount = document.querySelectorAll('.project-link').length;
                        item.textContent = `Projects: ${projectCount}`;
                        break;
                }
            });
        }

        formatTime(seconds) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        getMemoryUsage() {
            if (performance.memory) {
                return Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
            }
            return Math.floor(Math.random() * 50) + 20; // Fallback for browsers without memory API
        }
    }

    // Main Terminal Command Handler
    class MainTerminal {
        constructor() {
            this.init();
        }

        init() {
            this.bindKeyboardEvents();
            this.updateCursor('');
        }

        getCurrentCursorLine() {
            return document.querySelector('.line:last-child .cursor');
        }

        updateCursor(value) {
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
                line.innerHTML = `<span class="prompt">user@mini-projects:~$</span> <span class="command">${content}</span>`;
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
            
            TerminalMessages.limitTerminalMessages();
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }

        processCommand(command) {
            const cmd = command.toLowerCase().trim();
            
            // Navigation commands
            const projects = {
                'calculator': './calculator/',
                'calc': './calculator/',
                'weather': './weather-app/',
                'weather-app': './weather-app/',
                'dictionary': './dictionary-app/',
                'dict': './dictionary-app/',
                'password': './password-generator/',
                'password-gen': './password-generator/',
                'qr': './qr-code-generator/',
                'qr-code': './qr-code-generator/',
                'color': './color-picker/',
                'color-picker': './color-picker/',
                'stopwatch': './stopwatch/',
                'timer': './stopwatch/',
                'currency': './currency-converter/',
                'currency-converter': './currency-converter/',
                'temp': './temperature-converter/',
                'temperature': './temperature-converter/',
                'tic-tac-toe': './tic-tac-toe/',
                'ttt': './tic-tac-toe/',
                'rock-paper-scissors': './rock-paper-scissors/',
                'rps': './rock-paper-scissors/',
                'circle': './circle-game/',
                'circle-game': './circle-game/',
                'digital-clock': './digital-clock/',
                'analog-clock': './analog-clock/',
                'bb-quotes': './bb-quotes-api/',
                'quick-sign': './quick-sign/'
            };

            if (projects[cmd]) {
                window.location.href = projects[cmd];
                return null;
            }

            // System commands
            const systemCommands = {
                'help': () => this.getHelpText(),
                'ls': () => this.listProjects(),
                'list': () => this.listProjects(),
                'projects': () => this.listProjects(),
                'whoami': () => 'ubednama',
                'pwd': () => '/home/ubednama/mini-projects',
                'date': () => new Date().toLocaleString(),
                'clear': () => {
                    const output = document.querySelector('.terminal-output');
                    if (output) {
                        // Keep only the cursor line
                        const cursorLine = output.querySelector('.line:last-child');
                        output.innerHTML = '';
                        if (cursorLine) {
                            output.appendChild(cursorLine);
                        }
                    }
                    return null;
                },
                'theme': () => {
                    const themeManager = new ThemeManager();
                    themeManager.toggleTheme();
                    return `Theme switched to ${document.documentElement.getAttribute('data-theme')}`;
                }
            };

            if (systemCommands[cmd]) {
                return systemCommands[cmd]();
            }

            return `Command not found: ${command}. Type 'help' for available commands.`;
        }

        getHelpText() {
            return `Available Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 NAVIGATION:
  calculator, calc        → Advanced calculator with scientific functions
  weather, weather-app    → Real-time weather information
  dictionary, dict        → Word definitions and pronunciations
  password, password-gen  → Secure password generator
  qr, qr-code            → QR code generator
  color, color-picker     → Advanced color tools
  stopwatch, timer        → Precision timing and lap recording
  currency               → Live currency exchange rates
  temp, temperature      → Multi-scale temperature converter
  tic-tac-toe, ttt       → Strategic tic-tac-toe with AI
  rock-paper-scissors, rps → Classic rock paper scissors
  circle, circle-game     → Interactive circle game
  digital-clock          → World time zones
  analog-clock           → Classic analog display
  bb-quotes              → Breaking Bad quotes API
  quick-sign             → Digital signature tool

🖥️  SYSTEM:
  help                   → Show this help message
  ls, list, projects     → List all available projects
  clear                  → Clear terminal output
  theme                  → Toggle dark/light theme
  whoami                 → Show current user
  pwd                    → Show current directory
  date                   → Show current date and time

💡 TIP: Each project has its own terminal commands. Use 'help' inside any project to see app-specific commands.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        }

        listProjects() {
            return `📁 Available Projects (16):

[UTILITIES & TOOLS]
├── calculator           → Advanced calculator with scientific functions
├── weather-app          → Real-time weather information  
├── dictionary-app       → Word definitions and pronunciations
├── password-generator   → Secure password generator
├── qr-code-generator   → QR code generator
└── color-picker        → Advanced color tools

[TIME & PRODUCTIVITY]  
├── stopwatch           → Precision timing and lap recording
├── digital-clock       → World time zones
└── analog-clock        → Classic analog display

[CONVERTERS]
├── currency-converter  → Live currency exchange rates
└── temperature-converter → Multi-scale temperature converter

[GAMES & ENTERTAINMENT]
├── tic-tac-toe         → Strategic tic-tac-toe with AI
├── rock-paper-scissors → Classic rock paper scissors
├── circle-game         → Interactive circle game
├── bb-quotes-api       → Breaking Bad quotes API
└── quick-sign          → Digital signature tool

Type project name to navigate (e.g., 'calculator', 'weather')`;
        }

        bindKeyboardEvents() {
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
                        const result = this.processCommand(command);
                        if (result) {
                            this.addTerminalLine(result);
                        }
                        this.updateCursor('');
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

    // Initialize everything when DOM is ready
    function init() {
        // Initialize all managers
        new ThemeManager();
        new TerminalAnimator();
        new KeyboardManager();
        new TerminalControls();
        new PerformanceMonitor();
        new MainTerminal();

        // Add loading complete message
        setTimeout(() => {
            const output = document.querySelector('.terminal-output');
            const newLine = document.createElement('div');
            newLine.className = 'line';
            newLine.innerHTML = `
                <span class="prompt">system@terminal:~$</span>
                <span class="output">Terminal initialized successfully. Welcome!</span>
            `;
            output.appendChild(newLine);
        }, 1000);

        // Add some retro startup messages
        const startupMessages = [
            'Loading project database...',
            'Initializing theme system...',
            'Setting up keyboard navigation...',
            'Terminal ready for input.'
        ];

        startupMessages.forEach((message, index) => {
            setTimeout(() => {
                const output = document.querySelector('.terminal-output');
                const newLine = document.createElement('div');
                newLine.className = 'line';
                newLine.innerHTML = `
                    <span class="prompt">system@terminal:~$</span>
                    <span class="output">${message}</span>
                `;
                output.appendChild(newLine);
            }, (index + 2) * 500);
        });
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle visibility change for performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause animations when tab is not visible
            document.body.style.animationPlayState = 'paused';
        } else {
            // Resume animations when tab becomes visible
            document.body.style.animationPlayState = 'running';
        }
    });

    // Error handling
    window.addEventListener('error', (e) => {
        console.error('Terminal Error:', e.error);
        const output = document.querySelector('.terminal-output');
        if (output) {
            const errorLine = document.createElement('div');
            errorLine.className = 'line';
            errorLine.innerHTML = `
                <span class="prompt">system@terminal:~$</span>
                <span class="output" style="color: #ff5555;">Error: ${e.message}</span>
            `;
            output.appendChild(errorLine);
        }
    });

})();