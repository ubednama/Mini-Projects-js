class TemperatureConverter {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.updateConversion();
    }
    
    initializeElements() {
        this.temperatureInput = document.getElementById('temperature-input');
        this.fromUnit = document.getElementById('from-unit');
        this.toUnit = document.getElementById('to-unit');
        this.swapBtn = document.getElementById('swap-units');
        this.resultDisplay = document.getElementById('result-display');
        this.conversionFormula = document.getElementById('conversion-formula');
        this.currentTempMarker = document.getElementById('current-temp-marker');
    }
    
    bindEvents() {
        this.temperatureInput.addEventListener('input', () => this.updateConversion());
        this.fromUnit.addEventListener('change', () => this.updateConversion());
        this.toUnit.addEventListener('change', () => this.updateConversion());
        this.swapBtn.addEventListener('click', () => this.swapUnits());
        
        // Enter key support for input and selects
        this.temperatureInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.updateConversion(); // Trigger conversion update
            }
        });
        
        [this.fromUnit, this.toUnit].forEach(select => {
            select.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.updateConversion();
                }
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target === this.temperatureInput) return;
            
            switch(e.code) {
                case 'KeyS':
                    if (e.ctrlKey) {
                        e.preventDefault();
                        this.swapUnits();
                    }
                    break;
                case 'KeyC':
                    if (e.ctrlKey && e.shiftKey) {
                        e.preventDefault();
                        this.clearInput();
                    }
                    break;
            }
        });
    }
    
    updateConversion() {
        const inputValue = parseFloat(this.temperatureInput.value) || 0;
        const fromUnitValue = this.fromUnit.value;
        const toUnitValue = this.toUnit.value;
        
        // Convert to Celsius first (base unit)
        const celsiusValue = this.toCelsius(inputValue, fromUnitValue);
        
        // Convert from Celsius to target unit
        const result = this.fromCelsius(celsiusValue, toUnitValue);
        
        // Update display
        this.updateResultDisplay(result, toUnitValue);
        this.updateFormula(fromUnitValue, toUnitValue);
        this.updateTemperatureScale(celsiusValue);
        
        // Add animation
        this.resultDisplay.classList.add('updating');
        setTimeout(() => {
            this.resultDisplay.classList.remove('updating');
        }, 300);
    }
    
    toCelsius(value, unit) {
        switch(unit) {
            case 'celsius':
                return value;
            case 'fahrenheit':
                return (value - 32) * 5/9;
            case 'kelvin':
                return value - 273.15;
            case 'rankine':
                return (value - 491.67) * 5/9;
            case 'reaumur':
                return value * 5/4;
            default:
                return value;
        }
    }
    
    fromCelsius(celsius, unit) {
        switch(unit) {
            case 'celsius':
                return celsius;
            case 'fahrenheit':
                return (celsius * 9/5) + 32;
            case 'kelvin':
                return celsius + 273.15;
            case 'rankine':
                return (celsius * 9/5) + 491.67;
            case 'reaumur':
                return celsius * 4/5;
            default:
                return celsius;
        }
    }
    
    updateResultDisplay(result, unit) {
        const resultValue = this.resultDisplay.querySelector('.result-value');
        const resultUnit = this.resultDisplay.querySelector('.result-unit');
        
        resultValue.textContent = this.formatNumber(result);
        resultUnit.textContent = this.getUnitSymbol(unit);
    }
    
    updateFormula(fromUnit, toUnit) {
        const formulas = {
            'celsius-fahrenheit': '°F = (°C × 9/5) + 32',
            'fahrenheit-celsius': '°C = (°F - 32) × 5/9',
            'celsius-kelvin': 'K = °C + 273.15',
            'kelvin-celsius': '°C = K - 273.15',
            'fahrenheit-kelvin': 'K = (°F - 32) × 5/9 + 273.15',
            'kelvin-fahrenheit': '°F = (K - 273.15) × 9/5 + 32',
            'celsius-rankine': '°R = (°C × 9/5) + 491.67',
            'rankine-celsius': '°C = (°R - 491.67) × 5/9',
            'celsius-reaumur': '°Ré = °C × 4/5',
            'reaumur-celsius': '°C = °Ré × 5/4',
            'fahrenheit-reaumur': '°Ré = (°F - 32) × 4/9',
            'reaumur-fahrenheit': '°F = (°Ré × 9/4) + 32'
        };
        
        const key = `${fromUnit}-${toUnit}`;
        const formula = formulas[key] || `Convert ${fromUnit} to ${toUnit}`;
        
        this.conversionFormula.textContent = `Formula: ${formula}`;
    }
    
    updateTemperatureScale(celsiusValue) {
        // Position marker on scale (-273.15°C to 100°C range)
        const minTemp = -273.15;
        const maxTemp = 100;
        const clampedTemp = Math.max(minTemp, Math.min(maxTemp, celsiusValue));
        const percentage = ((clampedTemp - minTemp) / (maxTemp - minTemp)) * 100;
        
        this.currentTempMarker.style.left = `${percentage}%`;
        this.currentTempMarker.querySelector('.current-temp-value').textContent = 
            `${this.formatNumber(celsiusValue)}°C`;
        
        // Show/hide marker based on input
        if (this.temperatureInput.value.trim() !== '') {
            this.currentTempMarker.classList.add('visible');
        } else {
            this.currentTempMarker.classList.remove('visible');
        }
    }
    
    swapUnits() {
        const fromValue = this.fromUnit.value;
        const toValue = this.toUnit.value;
        
        this.fromUnit.value = toValue;
        this.toUnit.value = fromValue;
        
        // Convert the input value to the new "from" unit
        if (this.temperatureInput.value.trim() !== '') {
            const currentValue = parseFloat(this.temperatureInput.value);
            const celsiusValue = this.toCelsius(currentValue, fromValue);
            const newValue = this.fromCelsius(celsiusValue, toValue);
            this.temperatureInput.value = this.formatNumber(newValue);
        }
        
        this.updateConversion();
        this.showNotification('Units swapped! Use Ctrl+S to swap again');
    }
    
    clearInput() {
        this.temperatureInput.value = '';
        this.updateConversion();
        this.temperatureInput.focus();
        this.showNotification('Input cleared! Use Ctrl+Shift+C to clear again');
    }
    
    formatNumber(num) {
        if (Math.abs(num) < 0.01 && num !== 0) {
            return num.toExponential(2);
        }
        return Math.round(num * 100) / 100;
    }
    
    getUnitSymbol(unit) {
        const symbols = {
            'celsius': '°C',
            'fahrenheit': '°F',
            'kelvin': 'K',
            'rankine': '°R',
            'reaumur': '°Ré'
        };
        return symbols[unit] || unit;
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: var(--bg-primary);
            padding: var(--spacing-md);
            border-radius: var(--border-radius);
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Temperature facts and tips
class TemperatureFacts {
    constructor() {
        this.facts = [
            "Absolute zero (-273.15°C) is the coldest possible temperature",
            "The hottest temperature ever recorded on Earth was 54.4°C (129.9°F) in Death Valley",
            "The human body temperature averages 37°C (98.6°F)",
            "Water boils at 100°C (212°F) at sea level",
            "The Kelvin scale starts at absolute zero and uses Celsius-sized degrees",
            "The Rankine scale is to Fahrenheit what Kelvin is to Celsius",
            "The Réaumur scale was used in Europe before Celsius became standard",
            "Room temperature is typically around 20-22°C (68-72°F)",
            "The surface of the Sun is about 5,500°C (9,932°F)",
            "Liquid nitrogen boils at -196°C (-321°F)"
        ];
        
        this.showRandomFact();
    }
    
    showRandomFact() {
        const randomFact = this.facts[Math.floor(Math.random() * this.facts.length)];
        
        const factElement = document.createElement('div');
        factElement.className = 'temperature-fact';
        factElement.innerHTML = `
            <h4>💡 Did you know?</h4>
            <p>${randomFact}</p>
        `;
        factElement.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: var(--spacing-md);
            font-family: 'Courier New', monospace;
            font-size: 0.8rem;
            color: var(--text-primary);
            max-width: 300px;
            z-index: 100;
            opacity: 0.9;
        `;
        
        const h4 = factElement.querySelector('h4');
        h4.style.cssText = `
            margin: 0 0 var(--spacing-xs) 0;
            color: var(--accent-color);
            font-size: 0.9rem;
        `;
        
        const p = factElement.querySelector('p');
        p.style.cssText = `
            margin: 0;
            line-height: 1.4;
            color: var(--text-secondary);
        `;
        
        document.body.appendChild(factElement);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TemperatureConverter();
    new TemperatureFacts();
    
    // Add keyboard shortcuts info
    const shortcutsInfo = document.createElement('div');
    shortcutsInfo.className = 'shortcuts-info';
    shortcutsInfo.innerHTML = `
        <p><strong>Keyboard Shortcuts:</strong></p>
        <p>Ctrl+S - Swap Units | Ctrl+Shift+C - Clear</p>
    `;
    shortcutsInfo.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        padding: var(--spacing-sm);
        font-family: 'Courier New', monospace;
        font-size: 0.8rem;
        color: var(--text-secondary);
        opacity: 0.8;
        z-index: 100;
        max-width: 200px;
    `;
    
    document.body.appendChild(shortcutsInfo);
});