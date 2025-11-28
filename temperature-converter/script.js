class TemperatureConverter {
    constructor() {
        this.terminal = null;
        this.initializeElements();
        this.bindEvents();
        this.initializeTerminal();
        this.updateConversion();
    }

    initializeTerminal() {
        if (window.TerminalUtils && window.TerminalUtils.TerminalUI) {
            this.terminal = new window.TerminalUtils.TerminalUI('temperature-converter');
            this.terminal.log('Temperature Converter v2.0 initialized...', 'system');
        }
    }

    initializeElements() {
        this.temperatureInput = document.getElementById('temperature-input');
        this.fromUnit = document.getElementById('from-unit');
        this.toUnit = document.getElementById('to-unit');
        this.swapBtn = document.getElementById('swap-units');
        this.resultDisplay = document.getElementById('result-display');
        this.conversionFormula = document.getElementById('conversion-formula');
    }

    bindEvents() {
        this.temperatureInput.addEventListener('input', () => this.updateConversion());
        this.fromUnit.addEventListener('change', () => this.updateConversion());
        this.toUnit.addEventListener('change', () => this.updateConversion());
        this.swapBtn.addEventListener('click', () => this.swapUnits());
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

        if (this.terminal) {
            // Debounce terminal logging to avoid spamming
            if (this.logTimeout) clearTimeout(this.logTimeout);
            this.logTimeout = setTimeout(() => {
                this.terminal.log(`Converted ${inputValue} ${this.getUnitSymbol(fromUnitValue)} to ${this.formatNumber(result)} ${this.getUnitSymbol(toUnitValue)}`, 'info');
            }, 1000);
        }
    }

    toCelsius(value, unit) {
        switch (unit) {
            case 'celsius': return value;
            case 'fahrenheit': return (value - 32) * 5 / 9;
            case 'kelvin': return value - 273.15;
            default: return value;
        }
    }

    fromCelsius(celsius, unit) {
        switch (unit) {
            case 'celsius': return celsius;
            case 'fahrenheit': return (celsius * 9 / 5) + 32;
            case 'kelvin': return celsius + 273.15;
            default: return celsius;
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
            'kelvin-fahrenheit': '°F = (K - 273.15) × 9/5 + 32'
        };

        const key = `${fromUnit}-${toUnit}`;
        const formula = formulas[key] || `Convert ${fromUnit} to ${toUnit}`;

        this.conversionFormula.textContent = `Formula: ${formula}`;
    }

    swapUnits() {
        const fromValue = this.fromUnit.value;
        const toValue = this.toUnit.value;

        this.fromUnit.value = toValue;
        this.toUnit.value = fromValue;

        if (this.temperatureInput.value.trim() !== '') {
            const currentValue = parseFloat(this.temperatureInput.value);
            const celsiusValue = this.toCelsius(currentValue, fromValue);
            const newValue = this.fromCelsius(celsiusValue, toValue);
            this.temperatureInput.value = this.formatNumber(newValue);
        }

        this.updateConversion();
        if (this.terminal) this.terminal.log('Swapped units', 'success');
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
            'kelvin': 'K'
        };
        return symbols[unit] || unit;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TemperatureConverter();
});