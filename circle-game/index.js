// Circle Game Logic - Fullscreen
class CircleGame {
    constructor() {
        this.instructionOverlay = document.querySelector('#instruction-overlay');
        this.resultContainer = document.querySelector('#result-container');

        this.circleCoor = [];
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Attach to body to capture all clicks
        document.body.addEventListener('click', (e) => this.handleClick(e));
    }

    handleClick(e) {
        // Ignore clicks on interactive elements (Back button, Footer links)
        if (e.target.closest('.interactive') || e.target.closest('a')) {
            return;
        }

        // Reset if we already have 2 circles
        if (this.circleCoor.length === 2) {
            this.resetGame();
            return;
        }

        // Use global client coordinates directly since body is the canvas
        const x = e.clientX;
        const y = e.clientY;

        // Create Circle
        this.createCircle(x, y);

        // Update Game State
        if (this.circleCoor.length === 1) {
            this.instructionOverlay.textContent = "Click anywhere to place Circle 2";
        } else if (this.circleCoor.length === 2) {
            this.instructionOverlay.style.display = "none";
            this.checkResult();
        }
    }

    createCircle(x, y) {
        const randomRadius = Math.random() * 50 + 20; // 20-70px radius
        this.circleCoor.push({ x, y, r: randomRadius });

        const circle = document.createElement('div');
        circle.classList.add('circle');
        circle.style.left = x + 'px';
        circle.style.top = y + 'px';
        circle.style.width = (randomRadius * 2) + 'px';
        circle.style.height = (randomRadius * 2) + 'px';

        document.body.appendChild(circle);
    }

    checkResult() {
        const intersects = this.checkIntersection();

        const msg = document.createElement('div');
        msg.classList.add('result-msg');

        if (intersects) {
            msg.textContent = "Circles Overlap!";
            msg.classList.add('overlap');
        } else {
            msg.textContent = "Circles Don't Overlap";
            msg.classList.add('no-overlap');
        }

        // Clear previous results
        this.resultContainer.innerHTML = '';
        this.resultContainer.appendChild(msg);

        // Add reset instruction hint after delay
        setTimeout(() => {
            const hint = document.createElement('div');
            hint.className = 'reset-hint';
            hint.textContent = 'Click anywhere to reset';
            this.resultContainer.appendChild(hint);
        }, 500);
    }

    checkIntersection() {
        const c1 = this.circleCoor[0];
        const c2 = this.circleCoor[1];

        // Euclidean distance
        const distance = Math.hypot(c1.x - c2.x, c1.y - c2.y);

        // Check if distance <= sum of radii
        return distance <= (c1.r + c2.r);
    }

    resetGame() {
        // Remove circles from DOM
        const circles = document.querySelectorAll('.circle');
        circles.forEach(c => c.remove());

        // Reset state
        this.circleCoor = [];

        // Reset Text
        this.instructionOverlay.textContent = "Click anywhere to place Circle 1";
        this.instructionOverlay.style.display = "block";
        this.resultContainer.innerHTML = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CircleGame();
});