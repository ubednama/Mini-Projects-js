class Stopwatch {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.lapCount = 0;

        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.timeDisplay = document.getElementById('timeDisplay');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapBtn = document.getElementById('lapBtn');
        this.lapsContainer = document.getElementById('lapsContainer');

        this.minutesSpan = this.timeDisplay.querySelector('.minutes');
        this.secondsSpan = this.timeDisplay.querySelector('.seconds');
        this.millisecondsSpan = this.timeDisplay.querySelector('.milliseconds');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => {
            this.start();
        });
        this.pauseBtn.addEventListener('click', () => {
            this.pause();
        });
        this.resetBtn.addEventListener('click', () => {
            this.reset();
        });
        this.lapBtn.addEventListener('click', () => {
            this.recordLap();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;

            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    if (this.isRunning) {
                        this.pause();
                    } else {
                        this.start();
                    }
                    break;
                case 'KeyR':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.reset();
                    }
                    break;
                case 'KeyL':
                    if (this.isRunning) {
                        e.preventDefault();
                        this.recordLap();
                    }
                    break;
            }
        });
    }

    start() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.timerInterval = setInterval(() => this.updateDisplay(), 10);
            this.isRunning = true;

            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.lapBtn.disabled = false;

            this.timeDisplay.classList.add('running');
        }
    }

    pause() {
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.isRunning = false;

            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.lapBtn.disabled = true;

            this.timeDisplay.classList.remove('running');
        }
    }

    reset() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.elapsedTime = 0;
        this.lapCount = 0;
        this.startTime = 0;

        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.lapBtn.disabled = true;

        this.timeDisplay.classList.remove('running');

        this.minutesSpan.textContent = '00';
        this.secondsSpan.textContent = '00';
        this.millisecondsSpan.textContent = '00';

        this.clearLaps();
    }

    updateDisplay() {
        this.elapsedTime = Date.now() - this.startTime;

        const totalMilliseconds = Math.floor(this.elapsedTime / 10);
        const minutes = Math.floor(totalMilliseconds / 6000);
        const seconds = Math.floor((totalMilliseconds % 6000) / 100);
        const milliseconds = totalMilliseconds % 100;

        this.minutesSpan.textContent = minutes.toString().padStart(2, '0');
        this.secondsSpan.textContent = seconds.toString().padStart(2, '0');
        this.millisecondsSpan.textContent = milliseconds.toString().padStart(2, '0');
    }

    recordLap() {
        if (this.isRunning) {
            this.lapCount++;
            const currentTime = this.formatTime(this.elapsedTime);

            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            lapItem.innerHTML = `
                <span class="lap-number">Lap ${this.lapCount}</span>
                <span class="lap-time">${currentTime}</span>
            `;

            const noLaps = this.lapsContainer.querySelector('.no-laps');
            if (noLaps) {
                noLaps.remove();
            }

            this.lapsContainer.insertBefore(lapItem, this.lapsContainer.firstChild);
        }
    }

    clearLaps() {
        this.lapsContainer.innerHTML = '<div class="no-laps">No laps recorded</div>';
    }

    formatTime(milliseconds) {
        const totalMs = Math.floor(milliseconds / 10);
        const minutes = Math.floor(totalMs / 6000);
        const seconds = Math.floor((totalMs % 6000) / 100);
        const ms = totalMs % 100;

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Stopwatch();
});