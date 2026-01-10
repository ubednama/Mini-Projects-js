// Terminal-style Mini Projects JavaScript
(function () {
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
            // this.setupCursor(); // Removed
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

    // Keyboard Manager removed


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
                <span class="prompt">ubednama@terminal:~$</span>
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
            this.updateClock(); // Start clock
            setInterval(() => this.updateStatus(), 5000);
            setInterval(() => this.updateClock(), 1000);
        }

        updateClock() {
            const timeEl = document.getElementById('currentTime');
            if (timeEl) {
                const now = new Date();
                timeEl.textContent = '🕒 ' + now.toLocaleTimeString();
            }
        }

        updateStatus() {
            const statusItems = document.querySelectorAll('.status-item');
            const uptime = Math.floor((performance.now() - this.startTime) / 1000);
            const memory = this.getMemoryUsage();

            statusItems.forEach(item => {
                const type = item.dataset.type;
                switch (type) {
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

    // MainTerminal class removed


    // Initialize everything when DOM is ready
    function init() {
        // Initialize all managers
        new ThemeManager();
        new TerminalAnimator();
        // new KeyboardManager(); // Removed
        new TerminalControls();
        new PerformanceMonitor();
        // new MainTerminal(); // Removed

        // Add loading complete message
        setTimeout(() => {
            const output = document.querySelector('.terminal-output');
            const newLine = document.createElement('div');
            newLine.className = 'line';
            newLine.innerHTML = `
                <span class="prompt">ubednama@terminal:~$</span>
                <span class="output">Terminal initialized successfully. Welcome!</span>
            `;
            output.appendChild(newLine);
        }, 1000);

        // Add some retro startup messages
        const startupMessages = [
            'Loading project database...',
            'Initializing theme system...'
        ];

        startupMessages.forEach((message, index) => {
            setTimeout(() => {
                const output = document.querySelector('.terminal-output');
                const newLine = document.createElement('div');
                newLine.className = 'line';
                newLine.innerHTML = `
                    <span class="prompt">ubednama@terminal:~$</span>
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
                <span class="prompt">ubednama@terminal:~$</span>
                <span class="output" style="color: #ff5555;">Error: ${e.message}</span>
            `;
            output.appendChild(errorLine);
        }
    });

})();