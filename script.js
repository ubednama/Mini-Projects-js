// Terminal-style Mini Projects JavaScript
(function () {
    'use strict';

    // Theme Management Removed
    // class ThemeManager { ... }

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


    // Terminal Window Controls Removed
    // class TerminalControls { ... }

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
    // Initialize everything when DOM is ready
    function init() {
        // Initialize all managers
        // new ThemeManager(); // Removed
        new TerminalAnimator();
        // new KeyboardManager(); // Removed
        // new TerminalControls(); // Removed
        new PerformanceMonitor();
        // new MainTerminal(); // Removed

        // Add loading complete message
        setTimeout(() => {
            const output = document.querySelector('.terminal-output');
            if (!output) return; // Guard clause

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
            'Loading project database...'
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