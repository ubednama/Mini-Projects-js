// Digital Clock
class DigitalClock {
    constructor() {
        this.is24Hour = true;
        this.showSeconds = true;
        this.updateInterval = null;

        this.init();
    }

    init() {
        this.setupElements();
        this.startClock();
    }

    setupElements() {
        this.elements = {
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            ampm: document.getElementById('ampm'),
            dateDisplay: document.getElementById('date-display'),
            timezoneDisplay: document.getElementById('timezone-display'),
            toggleBtn: document.getElementById('toggle-format')
        };

        if (this.elements.toggleBtn) {
            this.elements.toggleBtn.addEventListener('click', () => this.toggleFormat());
        }
    }

    startClock() {
        this.updateClock();
        this.updateInterval = setInterval(() => this.updateClock(), 1000);
    }

    toggleFormat() {
        this.is24Hour = !this.is24Hour;
        this.elements.toggleBtn.textContent = this.is24Hour ? '24H' : '12H';
        this.updateClock();
    }

    updateClock() {
        const now = new Date();

        // Update time
        let hours, minutes, seconds, ampm = '';

        if (this.is24Hour) {
            hours = String(now.getHours()).padStart(2, '0');
            minutes = String(now.getMinutes()).padStart(2, '0');
            seconds = String(now.getSeconds()).padStart(2, '0');
        } else {
            let h = now.getHours();
            ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12;
            h = h ? h : 12; // the hour '0' should be '12'
            hours = String(h).padStart(2, '0');
            minutes = String(now.getMinutes()).padStart(2, '0');
            seconds = String(now.getSeconds()).padStart(2, '0');
        }

        this.elements.hours.textContent = hours;
        this.elements.minutes.textContent = minutes;
        this.elements.seconds.textContent = seconds;
        this.elements.ampm.textContent = ampm;

        // Hide seconds if disabled
        this.elements.seconds.style.display = this.showSeconds ? 'inline-block' : 'none';

        // Update date
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        const dateStr = now.toLocaleDateString('en-US', options);
        this.elements.dateDisplay.textContent = dateStr;

        // Update timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.elements.timezoneDisplay.textContent = timezone;
    }
}

// Initialize clock when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DigitalClock();
});