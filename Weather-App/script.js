// Unified Terminal Weather App - Synced with UI
const cityInput = document.getElementById("cityInput");
const btn = document.getElementById("btn");
const icon = document.querySelector(".icon");
const weather = document.querySelector(".weather");
const temperature = document.querySelector(".temperature");
const description = document.querySelector(".description");

let isInteractingWithApp = false;
let currentCity = '';

// Get current cursor line for terminal interaction
function getCurrentCursorLine() {
    return document.querySelector('.line:last-child .cursor');
}

// Update terminal cursor with current input
function updateTerminalCursor(value) {
    const cursorLine = getCurrentCursorLine();
    if (cursorLine) {
        if (value) {
            cursorLine.textContent = `fetch ${value}_`;
        } else {
            cursorLine.textContent = '_';
        }
    }
}

// Add terminal output line
function addTerminalLine(content, isCommand = false) {
    const terminalOutput = document.querySelector('.terminal-output');
    if (!terminalOutput) return;
    
    const line = document.createElement('div');
    line.className = 'line';
    
    if (isCommand) {
        line.innerHTML = `<span class="prompt">user@weather-app:~$</span> <span class="command">${content}</span>`;
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
    
    // Limit terminal messages
    TerminalMessages.limitTerminalMessages();
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Bidirectional sync: UI input changes update terminal
cityInput.addEventListener('input', (e) => {
    currentCity = e.target.value;
    isInteractingWithApp = true;
    updateTerminalCursor(currentCity);
});

cityInput.addEventListener('focus', () => {
    isInteractingWithApp = true;
    updateTerminalCursor(currentCity);
});

cityInput.addEventListener('blur', () => {
    if (!currentCity) {
        isInteractingWithApp = false;
        updateTerminalCursor('');
    }
});

// Search functionality
btn.addEventListener("click", () => {
    if (cityInput.value.trim()) {
        const city = cityInput.value.trim();
        addTerminalLine(`fetch ${city}`, true);
        getWeather(city);
    }
});

// Enter key support for input field
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (cityInput.value.trim()) {
            const city = cityInput.value.trim();
            addTerminalLine(`fetch ${city}`, true);
            getWeather(city);
        }
    }
});

function getWeather(city) {
    addTerminalLine(`Fetching weather data for ${city}...`);
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a5ac660febdf0fe62cea0ca919ac01f7`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const iconCode = data.weather[0].icon;
                icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon"/>`;

                const weatherCity = data.name;
                const weatherCountry = data.sys.country;
                weather.innerHTML = `${weatherCity}, ${weatherCountry}`;

                let weatherTemp = data.main.temp;
                weatherTemp = (weatherTemp - 273).toFixed();
                temperature.innerHTML = `${weatherTemp}°C`;

                const weatherDesc = data.weather[0].description;
                description.innerHTML = weatherDesc;

                // Add success message to terminal
                addTerminalLine(`Weather data retrieved for ${weatherCity}, ${weatherCountry}`);
                addTerminalLine(`Temperature: ${weatherTemp}°C, Condition: ${weatherDesc}`);
                
                // Clear interaction state
                currentCity = '';
                cityInput.value = '';
                isInteractingWithApp = false;
                updateTerminalCursor('');
            } else {
                // Error handling
                addTerminalLine(`Error: City "${city}" not found`);
                currentCity = '';
                isInteractingWithApp = false;
                updateTerminalCursor('');
            }
        })
        .catch(error => {
            addTerminalLine(`Error: Failed to fetch weather data`);
            currentCity = '';
            isInteractingWithApp = false;
            updateTerminalCursor('');
        });
}

// Enhanced Terminal Commander for Weather
class WeatherTerminal {
    static processCommand(command) {
        const cmd = command.toLowerCase().trim();
        
        // Weather-specific commands
        if (cmd.startsWith('fetch ')) {
            const city = command.substring(6).trim();
            if (city) {
                getWeather(city);
                return null;
            }
            return 'Usage: fetch [city_name]';
        }
        
        // System commands with mock responses
        const systemCommands = {
            'whoami': 'ubednama',
            'pwd': '/home/ubednama/weather-app',
            'date': new Date().toString(),
            'uptime': '15:25:22 up 2:15, 1 user, load average: 0.15, 0.10, 0.05',
            'uname -a': 'Linux weather-terminal 5.15.0-weather #1 SMP x86_64 GNU/Linux',
            'hostname': 'weather-terminal',
            'free -h': `              total        used        free      shared  buff/cache   available
Mem:          7.7Gi       2.1Gi       3.2Gi       128Mi       2.4Gi       5.1Gi
Swap:         2.0Gi          0B       2.0Gi`,
            'df -h': `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        20G  8.5G   11G  45% /
tmpfs           3.9G     0  3.9G   0% /dev/shm`
        };
        
        if (systemCommands[cmd]) {
            return systemCommands[cmd];
        }
        
        // App navigation commands
        const apps = {
            'calculator': '../calculator/',
            'tic-tac-toe': '../tic-tac-toe/',
            'weather': '../weather-app/',
            'dictionary': '../dictionary-app/',
            'currency': '../currency-converter/',
            'temperature': '../temperature-converter/',
            'password': '../password-generator/',
            'qr': '../qr-code-generator/',
            'color': '../color-picker/',
            'stopwatch': '../stopwatch/',
            'clock': '../digital-clock/',
            'analog': '../analog-clock/',
            'circle': '../circle-game/',
            'rps': '../rock-paper-scissors/',
            'sign': '../quick-sign/',
            'numbers': '../print-numbers/',
            'quotes': '../bb-quotes-api/',
            'home': '../index.html'
        };
        
        if (apps[cmd]) {
            window.location.href = apps[cmd];
            return null;
        }
        
        if (cmd.startsWith('echo ')) {
            return command.substring(5);
        }
        
        if (cmd === 'clear') {
            this.clearTerminal();
            return null;
        }
        
        return `bash: ${command}: command not found`;
    }
    
    static clearTerminal() {
        const terminalOutput = document.querySelector('.terminal-output');
        if (terminalOutput) {
            const lines = terminalOutput.querySelectorAll('.line');
            for (let i = 4; i < lines.length - 1; i++) {
                if (lines[i] && !lines[i].querySelector('.weather-container')) {
                    lines[i].remove();
                }
            }
        }
    }
}

// Global keyboard handler for unified terminal
document.addEventListener('keydown', (e) => {
    // Don't interfere with input fields when they have focus
    if (e.target === cityInput) {
        return;
    }
    
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    const cursorLine = getCurrentCursorLine();
    if (!cursorLine) return;
    
    if (e.key === 'Enter') {
        const command = cursorLine.textContent.replace('_', '').replace('fetch ', '').trim();
        
        if (isInteractingWithApp && command) {
            // Enter in weather context means fetch weather
            getWeather(command);
        } else {
            const fullCommand = cursorLine.textContent.replace('_', '').trim();
            if (fullCommand) {
                // Process as system command
                addTerminalLine(fullCommand, true);
                const result = WeatherTerminal.processCommand(fullCommand);
                if (result) {
                    addTerminalLine(result);
                }
                updateTerminalCursor('');
            }
        }
        e.preventDefault();
    } else if (e.key === 'Backspace') {
        if (isInteractingWithApp) {
            currentCity = currentCity.slice(0, -1);
            cityInput.value = currentCity;
            updateTerminalCursor(currentCity);
            if (!currentCity) {
                isInteractingWithApp = false;
            }
        } else {
            const currentText = cursorLine.textContent.replace('_', '');
            cursorLine.textContent = currentText.slice(0, -1) + '_';
        }
        e.preventDefault();
    } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        if (isInteractingWithApp) {
            // Update both UI and terminal
            currentCity += e.key;
            cityInput.value = currentCity;
            updateTerminalCursor(currentCity);
        } else {
            // Normal terminal typing
            const currentText = cursorLine.textContent.replace('_', '');
            cursorLine.textContent = currentText + e.key + '_';
            
            // Check if user is starting to type "fetch"
            if ((currentText + e.key).startsWith('fetch ')) {
                isInteractingWithApp = true;
                const cityPart = (currentText + e.key).substring(6);
                currentCity = cityPart;
                cityInput.value = currentCity;
            }
        }
        e.preventDefault();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateTerminalCursor('');
});