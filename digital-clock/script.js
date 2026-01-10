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
            dateDisplay: document.getElementById('date-display'),
            timezoneDisplay: document.getElementById('timezone-display')
        };
    }

    startClock() {
        this.updateClock();
        this.updateInterval = setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();

        // Update time
        let hours, minutes, seconds;

        if (this.is24Hour) {
            hours = String(now.getHours()).padStart(2, '0');
            minutes = String(now.getMinutes()).padStart(2, '0');
            seconds = String(now.getSeconds()).padStart(2, '0');
        } else {
            const time12 = now.toLocaleTimeString('en-US', {
                hour12: true,
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit'
            });
            const [time, ampm] = time12.split(' ');
            const [h, m, s] = time.split(':');
            hours = String(parseInt(h)).padStart(2, '0');
            minutes = m;
            seconds = s;
        }

        this.elements.hours.textContent = hours;
        this.elements.minutes.textContent = minutes;
        this.elements.seconds.textContent = seconds;

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