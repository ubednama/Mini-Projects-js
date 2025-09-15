// Universal Theme Management System
// This file can be included in any project to add theme toggle functionality

class UniversalThemeManager {
    constructor(options = {}) {
        this.theme = localStorage.getItem('theme') || 'light';
        this.options = {
            showNotifications: options.showNotifications !== false,
            keyboardShortcut: options.keyboardShortcut !== false,
            autoInject: options.autoInject !== false,
            position: options.position || 'top-right',
            ...options
        };
        this.init();
    }

    init() {
        this.applyTheme();
        if (this.options.autoInject) {
            this.injectToggleButton();
        }
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
        if (this.options.showNotifications) {
            this.showThemeNotification();
        }
    }

    injectToggleButton() {
        // Check if button already exists or if there's already a theme toggle
        if (document.querySelector('.universal-theme-toggle') || document.querySelector('.theme-toggle')) return;

        const button = document.createElement('button');
        button.className = 'universal-theme-toggle';
        button.setAttribute('aria-label', 'Toggle theme');
        button.style.cssText = `
            position: fixed;
            ${this.getPositionStyles()}
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 2px solid var(--border-color, #ddd);
            background: var(--bg-card, #fff);
            color: var(--text-primary, #333);
            font-size: 20px;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Add hover effects
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        });

        document.body.appendChild(button);
    }

    getPositionStyles() {
        const positions = {
            'top-right': 'top: 20px; right: 20px;',
            'top-left': 'top: 20px; left: 20px;',
            'bottom-right': 'bottom: 20px; right: 20px;',
            'bottom-left': 'bottom: 20px; left: 20px;'
        };
        return positions[this.options.position] || positions['top-right'];
    }

    updateToggleButton() {
        const toggleBtns = document.querySelectorAll('.theme-toggle, .universal-theme-toggle');
        toggleBtns.forEach(btn => {
            if (btn) {
                btn.textContent = this.theme === 'dark' ? '☀️' : '🌙';
                btn.setAttribute('aria-label', 
                    `Switch to ${this.theme === 'dark' ? 'light' : 'dark'} theme`);
            }
        });
    }

    showThemeNotification() {
        // Find terminal output area
        const terminalOutput = document.querySelector('.terminal-output');
        if (terminalOutput) {
            // Get app name from terminal title
            const terminalTitle = document.querySelector('.terminal-title');
            let appName = 'terminal';
            if (terminalTitle) {
                const titleText = terminalTitle.textContent;
                if (titleText.includes('@')) {
                    appName = titleText.split('@')[0];
                }
            }
            
            // Add terminal message in proper format
            const line = document.createElement('div');
            line.className = 'line';
            line.innerHTML = `<span class="prompt">user@${appName}:~$</span> <span class="command success">Theme switched to ${this.theme} mode ✓</span>`;
            
            // Find the cursor line and insert before it
            const cursorLine = terminalOutput.querySelector('.line:last-child');
            if (cursorLine && cursorLine.innerHTML.includes('cursor')) {
                terminalOutput.insertBefore(line, cursorLine);
            } else {
                terminalOutput.appendChild(line);
            }
            
            // Scroll to bottom
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    }

    bindEvents() {
        // Bind to all theme toggle buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('theme-toggle') || 
                e.target.classList.contains('universal-theme-toggle')) {
                this.toggleTheme();
            }
        });

        // Keyboard shortcut: Ctrl/Cmd + Shift + T
        if (this.options.keyboardShortcut) {
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }
    }

    // Public method to manually add theme support to existing elements
    addThemeSupport(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.addEventListener('click', () => this.toggleTheme());
        });
    }
}

// Auto-initialize if not in a module environment
if (typeof module === 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Only auto-initialize if no theme manager exists yet
        if (!window.themeManager) {
            // Delay check to allow other scripts to load and create their toggles
            setTimeout(() => {
                const hasExistingToggle = document.querySelector('.theme-toggle');
                window.themeManager = new UniversalThemeManager({
                    autoInject: !hasExistingToggle
                });
            }, 100);
        }
    });
}

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UniversalThemeManager;
}