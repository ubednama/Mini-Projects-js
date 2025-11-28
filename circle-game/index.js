// Circle Game with Terminal Integration
class CircleGame {
    constructor() {
        this.terminal = null;
        this.gameContainer = document.querySelector('.game-container');
        this.instructionOverlay = document.querySelector('.instruction-overlay');
        this.circleCoor = [];

        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeTerminal();
    }

    initializeTerminal() {
        if (window.TerminalUtils && window.TerminalUtils.TerminalUI) {
            this.terminal = new window.TerminalUtils.TerminalUI('circle-game');
            this.terminal.log('Circle Game v1.0 initialized...', 'system');
            this.terminal.log('Click anywhere in the game area to create circles', 'info');
        }
    }

    bindEvents() {
        this.gameContainer.addEventListener('click', (e) => this.handleClick(e));
    }

    handleClick(e) {
        // Check if click was inside game container
        const rect = this.gameContainer.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right ||
            e.clientY < rect.top || e.clientY > rect.bottom) {
            return;
        }

        const allCircles = document.querySelectorAll(".circle");
        const messageDiv = document.querySelector(".message");

        if (allCircles.length === 2) {
            // Clear existing circles and reset
            allCircles.forEach(circles => {
                this.gameContainer.removeChild(circles);
            });
            if (messageDiv) {
                this.gameContainer.removeChild(messageDiv);
            }
            this.circleCoor.length = 0; // Clear array
            this.instructionOverlay.textContent = "Click to place Circle 1";
            this.instructionOverlay.style.display = "block";

            if (this.terminal) this.terminal.log("Screen reset - ready for new circles", 'system');
            return;
        }

        // Calculate position relative to game container
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const randomRadius = Math.random() * 50 + 20; // 20-70px radius
        this.circleCoor.push({ x, y, r: randomRadius });

        const circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.position = 'absolute';
        circle.style.top = (y - randomRadius) + "px";
        circle.style.left = (x - randomRadius) + 'px';
        circle.style.width = (randomRadius * 2) + 'px';
        circle.style.height = (randomRadius * 2) + 'px';
        circle.style.borderRadius = '50%';
        circle.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
        circle.style.border = '2px solid var(--accent-color)';
        circle.style.opacity = '0.8';

        this.gameContainer.appendChild(circle);

        if (this.terminal) {
            this.terminal.log(`Circle ${this.circleCoor.length} created at (${Math.round(x)}, ${Math.round(y)}) with radius ${Math.round(randomRadius)}px`, 'success');
        }

        if (this.circleCoor.length === 1) {
            this.instructionOverlay.textContent = "Click to place Circle 2";
        } else if (this.circleCoor.length === 2) {
            this.instructionOverlay.style.display = "none";
            const intersects = this.checkIntersection();
            const message = document.createElement('div');
            message.classList.add('message');
            message.style.position = 'absolute';
            message.style.bottom = '20px';
            message.style.left = '50%';
            message.style.transform = 'translateX(-50%)';
            message.style.color = intersects ? 'var(--error-color)' : 'var(--success-color)';
            message.style.fontWeight = 'bold';
            message.style.background = 'var(--bg-card)';
            message.style.padding = '10px 20px';
            message.style.borderRadius = 'var(--radius-sm)';
            message.style.border = '1px solid var(--border-color)';
            message.innerHTML = intersects ? 'Circles Overlap!' : 'Circles Don\'t Overlap';
            this.gameContainer.appendChild(message);

            if (this.terminal) {
                this.terminal.log(intersects ? "Circles overlap detected!" : "Circles don't overlap", intersects ? 'warning' : 'success');
                this.terminal.log("Click anywhere to reset and draw new circles", 'info');
            }
        }
    }

    checkIntersection() {
        const circle1 = this.circleCoor[0];
        const circle2 = this.circleCoor[1];

        const x1 = circle1.x;
        const y1 = circle1.y;
        const r1 = circle1.r;

        const x2 = circle2.x;
        const y2 = circle2.y;
        const r2 = circle2.r;

        return Math.hypot(x1 - x2, y1 - y2) <= r1 + r2;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CircleGame();
});