// Analog Clock with Terminal Integration
class AnalogClock {
    constructor() {
        this.currentTimezone = null;
        this.showSeconds = true;
        this.showNumbers = true;
        this.smoothSeconds = false;
        this.currentStyle = 'classic';
        this.updateInterval = null;
        this.terminal = null;

        this.init();
    }

    init() {
        this.setupElements();
        this.createMarkers();
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.detectUserTimezone();
        this.initializeTerminal();
        this.startClock();
        this.applyStyle(this.currentStyle);
    }

    initializeTerminal() {
        if (window.TerminalUtils && window.TerminalUtils.TerminalUI) {
            this.terminal = new window.TerminalUtils.TerminalUI('analog-clock');
            this.terminal.log('Analog Clock v2.0 initialized...', 'system');
        }
    }

    detectUserTimezone() {
        try {
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            this.currentTimezone = null; // Keep as local
            this.elements.currentTimezone.textContent = `Local Time (${userTimezone})`;
            if (this.terminal) this.terminal.log(`Detected timezone: ${userTimezone}`, 'info');
        } catch (e) {
            this.elements.currentTimezone.textContent = 'Local Time';
            if (this.terminal) this.terminal.log('Using local timezone', 'info');
        }
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
            timezoneSelect: document.getElementById('timezone-select'),
            applyTimezone: document.getElementById('apply-timezone'),
            resetTimezone: document.getElementById('reset-timezone'),
            currentTimezone: document.getElementById('current-timezone'),
            styleButtons: document.querySelectorAll('.style-btn-small')
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
            hourMarkersContainer.appendChild(marker);
        }

        // Create minute markers
        for (let i = 0; i < 60; i++) {
            if (i % 5 !== 0) { // Skip hour positions
                const marker = document.createElement('div');
                marker.className = 'minute-marker';
                marker.style.transform = `rotate(${i * 6}deg)`;
                minuteMarkersContainer.appendChild(marker);
            }
        }
    }

    setupEventListeners() {
        // Toggle controls
        this.elements.showSeconds.addEventListener('change', () => {
            this.showSeconds = this.elements.showSeconds.checked;
            this.updateSecondHandVisibility();
            if (this.terminal) this.terminal.log(`Seconds ${this.showSeconds ? 'enabled' : 'disabled'}`, 'info');
        });

        this.elements.showNumbers.addEventListener('change', () => {
            this.showNumbers = this.elements.showNumbers.checked;
            this.updateNumbersVisibility();
            if (this.terminal) this.terminal.log(`Numbers ${this.showNumbers ? 'enabled' : 'disabled'}`, 'info');
        });

        this.elements.smoothSeconds.addEventListener('change', () => {
            this.smoothSeconds = this.elements.smoothSeconds.checked;
            if (this.terminal) this.terminal.log(`Smooth seconds ${this.smoothSeconds ? 'enabled' : 'disabled'}`, 'info');
        });

        // Style buttons
        this.elements.styleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const style = button.dataset.style;
                this.applyStyle(style);
                if (this.terminal) this.terminal.log(`Style changed to ${style}`, 'success');
            });
        });

        // Timezone controls
        this.elements.applyTimezone.addEventListener('click', () => {
            const selectedTimezone = this.elements.timezoneSelect.value;
            if (selectedTimezone) {
                this.setTimezone(selectedTimezone);
                if (this.terminal) this.terminal.log(`Timezone set to ${selectedTimezone}`, 'success');
            }
        });

        this.elements.resetTimezone.addEventListener('click', () => {
            this.setTimezone(null);
            if (this.terminal) this.terminal.log('Timezone reset to local', 'info');
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

            switch (e.code) {
                case 'KeyS':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.elements.showSeconds.click();
                    }
                    break;
                case 'KeyN':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.elements.showNumbers.click();
                    }
                    break;
            }
        });
    }

    setTimezone(timezone) {
        this.currentTimezone = timezone;
        if (timezone) {
            this.elements.currentTimezone.textContent = timezone.replace('_', ' ');
            this.elements.timezoneSelect.value = timezone;
        } else {
            this.detectUserTimezone();
            this.elements.timezoneSelect.value = '';
        }
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
        this.elements.secondHand.style.display = this.showSeconds ? 'block' : 'none';
    }

    updateNumbersVisibility() {
        const numbers = document.querySelector('.clock-numbers');
        numbers.style.display = this.showNumbers ? 'block' : 'none';
    }

    startClock() {
        this.updateClock();
        this.updateInterval = setInterval(() => this.updateClock(), this.smoothSeconds ? 16 : 1000);
    }

    updateClock() {
        const now = this.currentTimezone ?
            new Date(new Date().toLocaleString('en-US', { timeZone: this.currentTimezone })) :
            new Date();

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
        this.elements.hourHand.style.transform = `rotate(${hourAngle}deg)`;
        this.elements.minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
        this.elements.secondHand.style.transform = `rotate(${secondAngle}deg)`;
    }
}

// Initialize clock when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnalogClock();
});