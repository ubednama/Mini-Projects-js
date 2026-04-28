const STORAGE_KEY = 'stopwatch-state-v1';

class Stopwatch {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.lapCount = 0;
        this.laps = [];

        this.initializeElements();
        this.bindEvents();
        this.restoreState();
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
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.lapBtn.addEventListener('click', () => this.recordLap());

        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;

            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    this.isRunning ? this.pause() : this.start();
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

        // Persist before unload so refresh doesn't lose state.
        window.addEventListener('beforeunload', () => this.saveState());
        window.addEventListener('pagehide', () => this.saveState());
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
            this.saveState();
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
            this.saveState();
        }
    }

    reset() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.elapsedTime = 0;
        this.lapCount = 0;
        this.startTime = 0;
        this.laps = [];

        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.lapBtn.disabled = true;

        this.timeDisplay.classList.remove('running');

        this.minutesSpan.textContent = '00';
        this.secondsSpan.textContent = '00';
        this.millisecondsSpan.textContent = '00';

        this.clearLaps();
        this.saveState();
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
            this.laps.unshift({ n: this.lapCount, t: currentTime });
            this.laps = this.laps.slice(0, 100);
            this.renderLaps();
            this.saveState();
        }
    }

    renderLaps() {
        if (this.laps.length === 0) {
            this.clearLaps();
            return;
        }
        this.lapsContainer.replaceChildren();
        for (const lap of this.laps) {
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';

            const numSpan = document.createElement('span');
            numSpan.className = 'lap-number';
            numSpan.textContent = `Lap ${lap.n}`;

            const timeSpan = document.createElement('span');
            timeSpan.className = 'lap-time';
            timeSpan.textContent = lap.t;

            lapItem.append(numSpan, timeSpan);
            this.lapsContainer.appendChild(lapItem);
        }
    }

    clearLaps() {
        this.lapsContainer.replaceChildren();
        const noLaps = document.createElement('div');
        noLaps.className = 'no-laps';
        noLaps.textContent = 'No laps recorded';
        this.lapsContainer.appendChild(noLaps);
    }

    formatTime(milliseconds) {
        const totalMs = Math.floor(milliseconds / 10);
        const minutes = Math.floor(totalMs / 6000);
        const seconds = Math.floor((totalMs % 6000) / 100);
        const ms = totalMs % 100;

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    }

    saveState() {
        try {
            const state = {
                elapsedTime: this.elapsedTime,
                isRunning: this.isRunning,
                startTime: this.startTime,
                lapCount: this.lapCount,
                laps: this.laps,
                savedAt: Date.now(),
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (_) { /* storage may be disabled */ }
    }

    restoreState() {
        let state = null;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) state = JSON.parse(raw);
        } catch (_) { return; }

        if (!state) return;

        this.lapCount = state.lapCount || 0;
        this.laps = Array.isArray(state.laps) ? state.laps : [];

        if (state.isRunning && state.startTime) {
            // Resume from where we left off — startTime stays anchored to the
            // original wall clock, so elapsed advances naturally.
            this.elapsedTime = Date.now() - state.startTime;
            this.startTime = state.startTime;
            this.renderLaps();
            this.updateDisplay();
            this.start();
        } else {
            this.elapsedTime = state.elapsedTime || 0;
            this.startTime = 0;
            this.renderLaps();
            if (this.elapsedTime > 0) {
                this.updateDisplay = this.updateDisplay.bind(this);
                const totalMs = Math.floor(this.elapsedTime / 10);
                const minutes = Math.floor(totalMs / 6000);
                const seconds = Math.floor((totalMs % 6000) / 100);
                const ms = totalMs % 100;
                this.minutesSpan.textContent = minutes.toString().padStart(2, '0');
                this.secondsSpan.textContent = seconds.toString().padStart(2, '0');
                this.millisecondsSpan.textContent = ms.toString().padStart(2, '0');
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Stopwatch();
});
