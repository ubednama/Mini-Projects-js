// Color Picker Application
class ColorPicker {
    constructor() {
        this.currentColor = '#4169e1';
        this.colorHistory = this.loadHistory();
        this.terminal = null;

        this.initializeElements();
        this.bindEvents();
        this.initializeTerminal();
        this.updateColor(this.currentColor);
        this.renderHistory();
    }

    initializeTerminal() {
        // Terminal UI removed
    }

    initializeElements() {
        this.colorInput = document.getElementById('colorInput');
        this.hexInput = document.getElementById('hexInput');
        this.colorPreview = document.getElementById('colorPreview');
        this.hexValue = document.getElementById('hexValue');
        this.rgbValue = document.getElementById('rgbValue');
        this.hslValue = document.getElementById('hslValue');
        this.paletteDisplay = document.getElementById('paletteDisplay');
        this.colorHistoryEl = document.getElementById('colorHistory');
        this.toast = document.getElementById('toast');
    }

    bindEvents() {
        // Color input events
        this.colorInput.addEventListener('input', (e) => {
            const color = e.target.value;
            this.updateColor(color);
        });

        this.hexInput.addEventListener('input', (e) => {
            const hex = e.target.value;
            if (this.isValidHex(hex)) {
                this.updateColor(hex);
            }
        });

        this.hexInput.addEventListener('blur', (e) => {
            if (!this.isValidHex(e.target.value)) {
                e.target.value = this.currentColor;
            }
        });

        // Enter key support for hex input
        this.hexInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const hex = e.target.value;
                if (this.isValidHex(hex)) {
                    this.updateColor(hex);
                    this.addToHistory(hex);
                    if (this.terminal) this.terminal.log(`Set color to ${hex}`, 'success');
                }
            }
        });

        // Copy buttons
        document.querySelectorAll('.copy-icon').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.target.dataset.format;
                this.copyToClipboard(format);
            });
        });

        // Palette generation buttons
        document.getElementById('generateMonochromatic').addEventListener('click', () => {
            this.generatePalette('monochromatic');
            if (this.terminal) this.terminal.log('Generated monochromatic palette', 'info');
        });

        document.getElementById('generateComplementary').addEventListener('click', () => {
            this.generatePalette('complementary');
            if (this.terminal) this.terminal.log('Generated complementary palette', 'info');
        });

        document.getElementById('generateTriadic').addEventListener('click', () => {
            this.generatePalette('triadic');
            if (this.terminal) this.terminal.log('Generated triadic palette', 'info');
        });

        document.getElementById('generateAnalogous').addEventListener('click', () => {
            this.generatePalette('analogous');
            if (this.terminal) this.terminal.log('Generated analogous palette', 'info');
        });
    }

    updateColor(color) {
        this.currentColor = color;
        this.colorInput.value = color;
        this.hexInput.value = color;
        this.colorPreview.style.backgroundColor = color;
        this.colorPreview.classList.add('changing');

        setTimeout(() => {
            this.colorPreview.classList.remove('changing');
        }, 300);

        // Update all format displays
        this.updateFormats(color);

        // Add to history
        this.addToHistory(color);
    }

    updateFormats(hex) {
        const rgb = this.hexToRgb(hex);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);

        this.hexValue.textContent = hex.toUpperCase();
        this.rgbValue.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        this.hslValue.textContent = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
    }

    generatePalette(type) {
        const rgb = this.hexToRgb(this.currentColor);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        let colors = [];

        switch (type) {
            case 'monochromatic':
                colors = this.generateMonochromatic(hsl);
                break;
            case 'complementary':
                colors = this.generateComplementary(hsl);
                break;
            case 'triadic':
                colors = this.generateTriadic(hsl);
                break;
            case 'analogous':
                colors = this.generateAnalogous(hsl);
                break;
        }

        this.renderPalette(colors);
    }

    generateMonochromatic(hsl) {
        const colors = [];
        const baseHue = hsl.h;
        const baseSat = hsl.s;

        for (let i = 0; i < 6; i++) {
            const lightness = 20 + (i * 15);
            const rgb = this.hslToRgb(baseHue, baseSat, lightness);
            colors.push(this.rgbToHex(rgb.r, rgb.g, rgb.b));
        }

        return colors;
    }

    generateComplementary(hsl) {
        const colors = [];
        const baseHue = hsl.h;
        const complementaryHue = (baseHue + 180) % 360;

        // Base color variations
        colors.push(this.hslToHexString(baseHue, hsl.s, Math.max(20, hsl.l - 20)));
        colors.push(this.hslToHexString(baseHue, hsl.s, hsl.l));
        colors.push(this.hslToHexString(baseHue, hsl.s, Math.min(80, hsl.l + 20)));

        // Complementary color variations
        colors.push(this.hslToHexString(complementaryHue, hsl.s, Math.max(20, hsl.l - 20)));
        colors.push(this.hslToHexString(complementaryHue, hsl.s, hsl.l));
        colors.push(this.hslToHexString(complementaryHue, hsl.s, Math.min(80, hsl.l + 20)));

        return colors;
    }

    generateTriadic(hsl) {
        const colors = [];
        const baseHue = hsl.h;

        for (let i = 0; i < 3; i++) {
            const hue = (baseHue + (i * 120)) % 360;
            colors.push(this.hslToHexString(hue, hsl.s, Math.max(20, hsl.l - 10)));
            colors.push(this.hslToHexString(hue, hsl.s, hsl.l));
        }

        return colors;
    }

    generateAnalogous(hsl) {
        const colors = [];
        const baseHue = hsl.h;

        for (let i = -2; i <= 3; i++) {
            const hue = (baseHue + (i * 30) + 360) % 360;
            colors.push(this.hslToHexString(hue, hsl.s, hsl.l));
        }

        return colors;
    }

    renderPalette(colors) {
        this.paletteDisplay.innerHTML = '';

        colors.forEach(color => {
            const colorEl = document.createElement('div');
            colorEl.className = 'palette-color';
            colorEl.style.backgroundColor = color;
            colorEl.dataset.color = color;
            colorEl.addEventListener('click', () => {
                this.updateColor(color);
                if (this.terminal) this.terminal.log(`Selected palette color: ${color}`, 'info');
            });
            this.paletteDisplay.appendChild(colorEl);
        });
    }

    addToHistory(color) {
        if (!this.colorHistory.includes(color)) {
            this.colorHistory.unshift(color);
            if (this.colorHistory.length > 12) {
                this.colorHistory.pop();
            }
            this.saveHistory();
            this.renderHistory();
        }
    }

    renderHistory() {
        this.colorHistoryEl.innerHTML = '';

        this.colorHistory.forEach(color => {
            const colorEl = document.createElement('div');
            colorEl.className = 'history-color';
            colorEl.style.backgroundColor = color;
            colorEl.title = color;
            colorEl.addEventListener('click', () => {
                this.updateColor(color);
                if (this.terminal) this.terminal.log(`Selected history color: ${color}`, 'info');
            });
            this.colorHistoryEl.appendChild(colorEl);
        });
    }

    loadHistory() {
        const saved = localStorage.getItem('colorPickerHistory');
        return saved ? JSON.parse(saved) : [];
    }

    saveHistory() {
        localStorage.setItem('colorPickerHistory', JSON.stringify(this.colorHistory));
    }

    copyToClipboard(format) {
        let textToCopy = '';

        switch (format) {
            case 'hex':
                textToCopy = this.hexValue.textContent;
                break;
            case 'rgb':
                textToCopy = this.rgbValue.textContent;
                break;
            case 'hsl':
                textToCopy = this.hslValue.textContent;
                break;
        }

        if (window.TerminalUtils) {
            window.TerminalUtils.copyToClipboard(textToCopy, () => {
                if (this.terminal) this.terminal.log(`${format.toUpperCase()} copied to clipboard`, 'success');
                this.showToast(`${format.toUpperCase()} copied!`);
            }, (err) => {
                this.showToast('Failed to copy', 'error');
            });
        }
    }

    showToast(message) {
        if (window.TerminalUtils) {
            window.TerminalUtils.showToast(message, 'info');
        }
    }

    isValidHex(hex) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }

    // Color conversion utilities
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: h * 360,
            s: s * 100,
            l: l * 100
        };
    }

    hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;

        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    hslToHexString(h, s, l) {
        const rgb = this.hslToRgb(h, s, l);
        return this.rgbToHex(rgb.r, rgb.g, rgb.b);
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ColorPicker();
});