// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.bindEvents();
        this.updateToggleButton();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        this.updateToggleButton();
        this.showThemeNotification();
    }

    updateToggleButton() {
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = this.theme === 'dark' ? '☀️' : '🌙';
            toggleBtn.setAttribute('aria-label', 
                `Switch to ${this.theme === 'dark' ? 'light' : 'dark'} theme`);
        }
    }

    showThemeNotification() {
        const notification = document.createElement('div');
        notification.className = 'theme-notification';
        notification.textContent = `Switched to ${this.theme} theme`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-card);
            color: var(--text-primary);
            padding: 8px 16px;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            font-size: 14px;
            z-index: 1001;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            box-shadow: var(--shadow-md);
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });
        
        // Remove after 2 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }

    bindEvents() {
        const toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleTheme());
        }

        // Keyboard shortcut: Ctrl/Cmd + Shift + T
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }
}

// Color Picker Application
class ColorPicker {
    constructor() {
        this.currentColor = '#4169e1';
        this.colorHistory = this.loadHistory();
        this.initializeElements();
        this.bindEvents();
        this.updateColor(this.currentColor);
        this.renderHistory();
        this.initializeTerminal();
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
            line.innerHTML = `<span class="prompt">user@color-picker:~$</span> <span class="command">${content}</span>`;
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
        
        TerminalMessages.limitTerminalMessages();
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    processTerminalCommand(command) {
        const cmd = command.toLowerCase().trim();
        
        // Check if it's a hex color
        if (/^#?[0-9a-f]{3,6}$/i.test(cmd)) {
            const hexColor = cmd.startsWith('#') ? cmd : '#' + cmd;
            try {
                this.updateColor(hexColor);
                this.addToHistory(hexColor);
                return `Color set to ${hexColor}`;
            } catch (e) {
                return `Invalid hex color: ${cmd}`;
            }
        }
        
        // Color commands
        const commands = {
            'random': () => {
                const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
                this.updateColor(randomColor);
                this.addToHistory(randomColor);
                return `Random color: ${randomColor}`;
            },
            'palette': (type) => {
                if (['monochromatic', 'complementary', 'triadic', 'analogous'].includes(type)) {
                    this.generatePalette(type);
                    return `Generated ${type} palette`;
                } else {
                    return 'Available palettes: monochromatic, complementary, triadic, analogous';
                }
            },
            'current': () => `Current color: ${this.currentColor}`,
            'history': () => {
                if (this.colorHistory.length === 0) return 'No color history';
                return 'Recent colors: ' + this.colorHistory.slice(-5).join(', ');
            },
            'clear': () => {
                this.colorHistory = [];
                this.saveHistory();
                this.renderHistory();
                return 'Color history cleared';
            },
            'help': () => `Color Picker Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎨 COLOR INPUT:
  #ff0000                → Set color by hex code (with #)
  ff0000                 → Set color by hex code (without #)
  random                 → Generate random color

📊 COLOR INFO:
  current                → Show current color value
  history                → Show recent color history (last 5)

🛠️  UTILITIES:
  clear                  → Clear color history
  help                   → Show this help message

💡 USAGE EXAMPLES:
  #ff0000                → Set to red
  00ff00                 → Set to green
  0000ff                 → Set to blue
  random                 → Surprise me!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        };
        
        // Handle commands with parameters
        const cmdParts = cmd.split(' ');
        const baseCmd = cmdParts[0];
        const param = cmdParts[1];
        
        if (commands[baseCmd]) {
            if (baseCmd === 'palette' && param) {
                return commands[baseCmd](param);
            } else if (baseCmd !== 'palette') {
                return commands[baseCmd]();
            }
        }
        
        if (commands[cmd]) {
            return commands[cmd]();
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

    initializeElements() {
        this.colorInput = document.getElementById('colorInput');
        this.hexInput = document.getElementById('hexInput');
        this.colorPreview = document.getElementById('colorPreview');
        this.colorName = document.getElementById('colorName');
        this.colorDescription = document.getElementById('colorDescription');
        this.hexValue = document.getElementById('hexValue');
        this.rgbValue = document.getElementById('rgbValue');
        this.hslValue = document.getElementById('hslValue');
        this.hsvValue = document.getElementById('hsvValue');
        this.paletteDisplay = document.getElementById('paletteDisplay');
        this.colorHistoryEl = document.getElementById('colorHistory');
        this.toast = document.getElementById('toast');
    }

    bindEvents() {
        // Color input events
        this.colorInput.addEventListener('input', (e) => {
            const color = e.target.value;
            this.addTerminalLine(color, true);
            this.updateColor(color);
        });

        this.hexInput.addEventListener('input', (e) => {
            const hex = e.target.value;
            if (this.isValidHex(hex)) {
                this.addTerminalLine(hex, true);
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
                    this.addTerminalLine(hex, true);
                    this.updateColor(hex);
                    this.addToHistory(hex);
                }
            }
        });

        // Copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.target.dataset.format;
                this.copyToClipboard(format);
            });
        });

        // Palette generation buttons
        document.getElementById('generateMonochromatic').addEventListener('click', () => {
            this.addTerminalLine('palette monochromatic', true);
            this.generatePalette('monochromatic');
        });

        document.getElementById('generateComplementary').addEventListener('click', () => {
            this.addTerminalLine('palette complementary', true);
            this.generatePalette('complementary');
        });

        document.getElementById('generateTriadic').addEventListener('click', () => {
            this.addTerminalLine('palette triadic', true);
            this.generatePalette('triadic');
        });

        document.getElementById('generateAnalogous').addEventListener('click', () => {
            this.addTerminalLine('palette analogous', true);
            this.generatePalette('analogous');
        });

        // Clear history
        document.getElementById('clearHistory').addEventListener('click', () => {
            this.clearHistory();
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
        
        // Update color name and description
        this.updateColorInfo(color);
        
        // Add to history
        this.addToHistory(color);
    }

    updateFormats(hex) {
        const rgb = this.hexToRgb(hex);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const hsv = this.rgbToHsv(rgb.r, rgb.g, rgb.b);

        this.hexValue.textContent = hex.toUpperCase();
        this.rgbValue.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        this.hslValue.textContent = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
        this.hsvValue.textContent = `hsv(${Math.round(hsv.h)}, ${Math.round(hsv.s)}%, ${Math.round(hsv.v)}%)`;
    }

    updateColorInfo(hex) {
        const colorInfo = this.getColorInfo(hex);
        this.colorName.textContent = colorInfo.name;
        this.colorDescription.textContent = colorInfo.description;
    }

    getColorInfo(hex) {
        const rgb = this.hexToRgb(hex);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        // Simple color naming based on HSL values
        let name = 'Custom Color';
        let description = 'A unique color';
        
        const hue = hsl.h;
        const saturation = hsl.s;
        const lightness = hsl.l;
        
        if (saturation < 10) {
            if (lightness < 20) {
                name = 'Black';
                description = 'The darkest color';
            } else if (lightness > 80) {
                name = 'White';
                description = 'The lightest color';
            } else {
                name = 'Gray';
                description = 'A neutral color';
            }
        } else {
            if (hue >= 0 && hue < 30) {
                name = 'Red';
                description = 'A warm, energetic color';
            } else if (hue >= 30 && hue < 60) {
                name = 'Orange';
                description = 'A vibrant, cheerful color';
            } else if (hue >= 60 && hue < 90) {
                name = 'Yellow';
                description = 'A bright, sunny color';
            } else if (hue >= 90 && hue < 150) {
                name = 'Green';
                description = 'A natural, calming color';
            } else if (hue >= 150 && hue < 210) {
                name = 'Cyan';
                description = 'A cool, refreshing color';
            } else if (hue >= 210 && hue < 270) {
                name = 'Blue';
                description = 'A calm, trustworthy color';
            } else if (hue >= 270 && hue < 330) {
                name = 'Purple';
                description = 'A royal, mysterious color';
            } else {
                name = 'Magenta';
                description = 'A bold, creative color';
            }
            
            // Add intensity descriptors
            if (lightness < 30) {
                name = `Dark ${name}`;
            } else if (lightness > 70) {
                name = `Light ${name}`;
            }
            
            if (saturation > 80) {
                description = `A vibrant ${description.toLowerCase()}`;
            } else if (saturation < 40) {
                description = `A muted ${description.toLowerCase()}`;
            }
        }
        
        return { name, description };
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
            });
            this.colorHistoryEl.appendChild(colorEl);
        });
    }

    clearHistory() {
        this.colorHistory = [];
        this.saveHistory();
        this.renderHistory();
        this.addTerminalLine('Color history cleared');
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
            case 'hsv':
                textToCopy = this.hsvValue.textContent;
                break;
        }
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            this.addTerminalLine(`${format.toUpperCase()} copied to clipboard`);
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.addTerminalLine(`${format.toUpperCase()} copied to clipboard`);
        });
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
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    rgbToHsv(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;
        
        let h = 0;
        const s = max === 0 ? 0 : diff / max;
        const v = max;
        
        if (diff !== 0) {
            switch (max) {
                case r: h = (g - b) / diff + (g < b ? 6 : 0); break;
                case g: h = (b - r) / diff + 2; break;
                case b: h = (r - g) / diff + 4; break;
            }
            h /= 6;
        }
        
        return {
            h: h * 360,
            s: s * 100,
            v: v * 100
        };
    }

    hslToHexString(h, s, l) {
        const rgb = this.hslToRgb(h, s, l);
        return this.rgbToHex(rgb.r, rgb.g, rgb.b);
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new ColorPicker();
});

// Add some keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'c':
                if (e.target.classList.contains('format-value')) {
                    e.preventDefault();
                    // Copy the focused format value
                }
                break;
        }
    }
});