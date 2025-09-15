// Analog Clock with Terminal Integration
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
        this.setupKeyboardShortcuts();
        this.detectUserTimezone();
        this.initializeTerminal();
        this.startClock();
        this.applyStyle(this.currentStyle);
        
        // Initialize terminal messages
        TerminalMessages.init();
        TerminalMessages.startClock();
    }

    // Terminal Integration Methods
    getCurrentCursorLine() {
        return document.querySelector('.line:last-child .cursor');
    }

    updateTerminalCursor(value) {
        const cursorLine = this.getCurrentCursorLine();
        if (cursorLine) {
            cursorLine.textContent = value + '_';
        }
    }

    addTerminalLine(content, isCommand = false) {
        const terminalOutput = document.querySelector('.terminal-output');
        if (!terminalOutput) return;
        
        const line = document.createElement('div');
        line.className = 'line';
        
        if (isCommand) {
            line.innerHTML = `<span class="prompt">user@analog-clock:~$</span> <span class="command">${content}</span>`;
        } else {
            line.innerHTML = `<span class="output">${content}</span>`;
        }
        
        // Insert before cursor line
        const cursorLine = terminalOutput.querySelector('.line:last-child');
        if (cursorLine && cursorLine.innerHTML.includes('cursor')) {
            terminalOutput.insertBefore(line, cursorLine);
        } else {
            terminalOutput.appendChild(line);
        }
        
        // Limit terminal messages to 6-7 lines
        this.limitTerminalMessages();
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    limitTerminalMessages() {
        const terminalOutput = document.querySelector('.terminal-output');
        if (!terminalOutput) return;
        
        const lines = terminalOutput.querySelectorAll('.line');
        const maxLines = 6; // Keep 6 lines + cursor line = 7 total
        
        if (lines.length > maxLines + 1) { // +1 for cursor line
            // Remove oldest lines (keep cursor line at the end)
            const linesToRemove = lines.length - maxLines - 1;
            for (let i = 0; i < linesToRemove; i++) {
                if (lines[i] && !lines[i].innerHTML.includes('cursor')) {
                    lines[i].remove();
                }
            }
        }
    }

    processTerminalCommand(command) {
        const cmd = command.toLowerCase().trim();
        const parts = cmd.split(' ');
        
        // Style commands
        if (parts[0] === 'style' && parts[1]) {
            const styles = ['classic', 'modern', 'minimal', 'retro', 'neon', 'terminal'];
            if (styles.includes(parts[1])) {
                this.applyStyle(parts[1]);
                return `Clock style changed to ${parts[1]}`;
            } else {
                return `Available styles: ${styles.join(', ')}`;
            }
        }
        
        // Enable/Disable commands
        if (parts[0] === 'enable' && parts[1]) {
            switch(parts[1]) {
                case 'seconds':
                    if (!this.showSeconds) this.elements.showSeconds.click();
                    return 'Second hand enabled';
                case 'numbers':
                    if (!this.showNumbers) this.elements.showNumbers.click();
                    return 'Clock numbers enabled';
                case 'smooth':
                    if (!this.smoothSeconds) this.elements.smoothSeconds.click();
                    return 'Smooth seconds enabled';
                default:
                    return 'Available options: seconds, numbers, smooth';
            }
        }
        
        if (parts[0] === 'disable' && parts[1]) {
            switch(parts[1]) {
                case 'seconds':
                    if (this.showSeconds) this.elements.showSeconds.click();
                    return 'Second hand disabled';
                case 'numbers':
                    if (this.showNumbers) this.elements.showNumbers.click();
                    return 'Clock numbers disabled';
                case 'smooth':
                    if (this.smoothSeconds) this.elements.smoothSeconds.click();
                    return 'Smooth seconds disabled';
                default:
                    return 'Available options: seconds, numbers, smooth';
            }
        }
        
        // Timezone commands
        if (parts[0] === 'timezone' && parts[1]) {
            const timezoneMap = {
                'local': null,
                'newyork': 'America/New_York',
                'losangeles': 'America/Los_Angeles',
                'london': 'Europe/London',
                'paris': 'Europe/Paris',
                'tokyo': 'Asia/Tokyo',
                'shanghai': 'Asia/Shanghai',
                'sydney': 'Australia/Sydney'
            };
            
            const tz = timezoneMap[parts[1]];
            if (tz !== undefined) {
                this.setTimezone(tz);
                return `Timezone set to ${parts[1] === 'local' ? 'local time' : parts[1]}`;
            } else {
                return 'Available timezones: local, newyork, losangeles, london, paris, tokyo, shanghai, sydney';
            }
        }
        
        // System commands
        const systemCommands = {
            'time': () => this.getCurrentTime12Hour(),
            'help': () => `Commands: style [name], enable/disable [seconds|numbers|smooth], timezone [zone], time, help`,
            'status': () => `Style: ${this.currentStyle}, Seconds: ${this.showSeconds ? 'on' : 'off'}, Numbers: ${this.showNumbers ? 'on' : 'off'}`
        };
        
        if (systemCommands[cmd]) {
            return systemCommands[cmd]();
        }
        
        return `Unknown command: ${command}. Type 'help' for available commands.`;
    }

    initializeTerminal() {
        this.updateTerminalCursor('');
        
        // Global keyboard handler
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            const cursorLine = this.getCurrentCursorLine();
            if (!cursorLine) return;
            
            if (e.key === 'Enter') {
                const command = cursorLine.textContent.replace('_', '').trim();
                
                if (command) {
                    this.addTerminalLine(command, true);
                    const result = this.processTerminalCommand(command);
                    if (result) {
                        this.addTerminalLine(result);
                    }
                    this.updateTerminalCursor('');
                }
                e.preventDefault();
            } else if (e.key === 'Backspace') {
                const currentText = cursorLine.textContent.replace('_', '');
                cursorLine.textContent = currentText.slice(0, -1) + '_';
                e.preventDefault();
            } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
                const currentText = cursorLine.textContent.replace('_', '');
                cursorLine.textContent = currentText + e.key + '_';
                e.preventDefault();
            }
        });
    }

    detectUserTimezone() {
        try {
            const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            this.currentTimezone = null; // Keep as local
            this.elements.currentTimezone.textContent = `Local Time (${userTimezone})`;
            this.addTerminalLine(`Detected timezone: ${userTimezone}`);
        } catch (e) {
            this.elements.currentTimezone.textContent = 'Local Time';
            this.addTerminalLine('Using local timezone');
        }
    }

    getCurrentTime12Hour() {
        const now = this.currentTimezone ? 
            new Date().toLocaleString('en-US', { timeZone: this.currentTimezone }) : 
            new Date();
        
        const time = new Date(now);
        const hours12 = time.getHours() % 12 || 12;
        const minutes = time.getMinutes().toString().padStart(2, '0');
        const seconds = time.getSeconds().toString().padStart(2, '0');
        const ampm = time.getHours() >= 12 ? 'PM' : 'AM';
        
        return `${hours12}:${minutes}:${seconds} ${ampm}`;
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
        // Toggle controls with terminal logging
        this.elements.showSeconds.addEventListener('change', () => {
            this.showSeconds = this.elements.showSeconds.checked;
            const command = this.showSeconds ? 'enable seconds' : 'disable seconds';
            this.addTerminalLine(command, true);
            this.addTerminalLine(`Second hand ${this.showSeconds ? 'enabled' : 'disabled'}`);
            this.updateSecondHandVisibility();
        });

        this.elements.showNumbers.addEventListener('change', () => {
            this.showNumbers = this.elements.showNumbers.checked;
            const command = this.showNumbers ? 'enable numbers' : 'disable numbers';
            this.addTerminalLine(command, true);
            this.addTerminalLine(`Clock numbers ${this.showNumbers ? 'enabled' : 'disabled'}`);
            this.updateNumbersVisibility();
        });

        this.elements.smoothSeconds.addEventListener('change', () => {
            this.smoothSeconds = this.elements.smoothSeconds.checked;
            const command = this.smoothSeconds ? 'enable smooth' : 'disable smooth';
            this.addTerminalLine(command, true);
            this.addTerminalLine(`Smooth seconds ${this.smoothSeconds ? 'enabled' : 'disabled'}`);
        });

        // Style buttons with terminal logging
        this.elements.styleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const style = button.dataset.style;
                this.addTerminalLine(`style ${style}`, true);
                this.applyStyle(style);
                this.addTerminalLine(`Clock style changed to ${style}`);
            });
        });

        // Timezone controls with terminal logging
        this.elements.applyTimezone.addEventListener('click', () => {
            const selectedTimezone = this.elements.timezoneSelect.value;
            if (selectedTimezone) {
                this.addTerminalLine(`timezone ${selectedTimezone.split('/')[1].toLowerCase()}`, true);
                this.setTimezone(selectedTimezone);
                this.addTerminalLine(`Timezone set to ${selectedTimezone}`);
            }
        });

        this.elements.resetTimezone.addEventListener('click', () => {
            this.addTerminalLine('timezone local', true);
            this.setTimezone(null);
            this.addTerminalLine('Timezone reset to local time');
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
            
            switch(e.code) {
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