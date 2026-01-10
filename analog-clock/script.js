// Analog Clock
class AnalogClock {
    constructor() {
        this.currentTimezone = null;
        this.showSeconds = true;
        this.showNumbers = true;
        this.smoothSeconds = false;
        this.currentStyle = 'classic';
        this.updateInterval = null;

        this.init();
    }

    init() {
        this.setupElements();
        this.createMarkers();
        this.setupEventListeners();
        this.startClock();
    }

    setupElements() {
        this.elements = {
            analogClock: document.getElementById('analog-clock'),
            hourHand: document.getElementById('hour-hand'),
            minuteHand: document.getElementById('minute-hand'),
            secondHand: document.getElementById('second-hand'),
            showSeconds: document.getElementById('show-seconds'),
            showNumbers: document.getElementById('show-numbers'),
            smoothSeconds: document.getElementById('smooth-seconds'),
            currentTimezone: document.getElementById('current-timezone'),
            styleButtons: document.querySelectorAll('.style-btn')
        };
    }

    createMarkers() {
        const hourMarkersContainer = document.querySelector('.hour-markers');
        const minuteMarkersContainer = document.querySelector('.minute-markers');

        // Create hour markers
        for (let i = 0; i < 12; i++) {
            const marker = document.createElement('div');
            marker.className = 'hour-marker';
            marker.style.transform = `rotate(${i * 30}deg)`;
            if (hourMarkersContainer) hourMarkersContainer.appendChild(marker);
        }

        // Create minute markers
        for (let i = 0; i < 60; i++) {
            if (i % 5 !== 0) { // Skip hour positions
                const marker = document.createElement('div');
                marker.className = 'minute-marker';
                marker.style.transform = `rotate(${i * 6}deg)`;
                if (minuteMarkersContainer) minuteMarkersContainer.appendChild(marker);
            }
        }
    }

    setupEventListeners() {
        // Toggle controls
        if (this.elements.showSeconds) {
            this.elements.showSeconds.addEventListener('change', () => {
                this.showSeconds = this.elements.showSeconds.checked;
                this.updateSecondHandVisibility();
            });
        }

        if (this.elements.showNumbers) {
            this.elements.showNumbers.addEventListener('change', () => {
                this.showNumbers = this.elements.showNumbers.checked;
                this.updateNumbersVisibility();
            });
        }

        if (this.elements.smoothSeconds) {
            this.elements.smoothSeconds.addEventListener('change', () => {
                this.smoothSeconds = this.elements.smoothSeconds.checked;
                this.startClock(); // Restart to change interval
            });
        }

        // Style buttons
        this.elements.styleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const style = button.dataset.style;
                this.applyStyle(style);
            });
        });
    }

    applyStyle(styleName) {
        this.currentStyle = styleName;

        // Remove all style classes
        this.elements.analogClock.className = 'analog-clock';

        // Add new style class
        this.elements.analogClock.classList.add(`style-${styleName}`);

        // Update active button
        this.elements.styleButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.style === styleName) {
                btn.classList.add('active');
            }
        });
    }

    updateSecondHandVisibility() {
        if (this.elements.secondHand) {
            this.elements.secondHand.style.display = this.showSeconds ? 'block' : 'none';
        }
    }

    updateNumbersVisibility() {
        const numbers = document.querySelector('.clock-numbers');
        if (numbers) numbers.style.display = this.showNumbers ? 'block' : 'none';
    }

    startClock() {
        if (this.updateInterval) clearInterval(this.updateInterval);
        this.updateClock();
        this.updateInterval = setInterval(() => this.updateClock(), this.smoothSeconds ? 16 : 1000);
    }

    updateClock() {
        const now = new Date();

        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const milliseconds = now.getMilliseconds();

        // Calculate angles
        const hourAngle = (hours * 30) + (minutes * 0.5);
        const minuteAngle = minutes * 6;
        const secondAngle = this.smoothSeconds ?
            (seconds * 6) + (milliseconds * 0.006) :
            seconds * 6;

        // Apply rotations
        if (this.elements.hourHand) this.elements.hourHand.style.transform = `rotate(${hourAngle}deg)`;
        if (this.elements.minuteHand) this.elements.minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
        if (this.elements.secondHand) this.elements.secondHand.style.transform = `rotate(${secondAngle}deg)`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AnalogClock();
});