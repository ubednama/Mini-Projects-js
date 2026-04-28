// Password Generator with Terminal Integration
class PasswordGenerator {
    constructor() {
        this.inputSlider = document.getElementById("inputSlider");
        this.sliderValue = document.getElementById("sliderValue");
        this.passBox = document.getElementById("passBox");
        this.lowercase = document.getElementById("lowercase");
        this.uppercase = document.getElementById("uppercase");
        this.numbers = document.getElementById("numbers");
        this.symbols = document.getElementById("symbols");
        this.genBtn = document.getElementById("genBtn");
        this.copyIcon = document.getElementById("copyIcon");
        this.strengthFill = document.getElementById("strengthFill");
        this.strengthLabel = document.getElementById("strengthLabel");

        this.lowerChars = "abcdefghijklmnopqrstuvwxyz";
        this.upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.allNumbers = "0123456789";
        this.allSymbols = "~!@#$%^&*";

        this.terminal = null;

        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeTerminal();
        this.sliderValue.textContent = this.inputSlider.value;
        this.updateStrength();
    }

    bindEvents() {
        const refreshStrength = () => this.updateStrength();

        this.inputSlider.addEventListener('input', () => {
            this.sliderValue.textContent = this.inputSlider.value;
            refreshStrength();
        });

        for (const cb of [this.lowercase, this.uppercase, this.numbers, this.symbols]) {
            cb.addEventListener('change', refreshStrength);
        }

        this.genBtn.addEventListener('click', () => {
            const password = this.generatePassword();
            this.passBox.value = password;
            this.updateStrength();

            if (this.terminal) {
                const length = this.inputSlider.value;
                const flags = [];
                if (this.lowercase.checked) flags.push('Lowercase');
                if (this.uppercase.checked) flags.push('Uppercase');
                if (this.numbers.checked) flags.push('Numbers');
                if (this.symbols.checked) flags.push('Symbols');

                this.terminal.log(`Generated ${length}-char password (${flags.join(', ')})`, 'success');
            }
        });

        this.copyIcon.addEventListener("click", () => {
            if (this.passBox.value !== "") {
                if (window.TerminalUtils) {
                    window.TerminalUtils.copyToClipboard(this.passBox.value, () => {
                        if (this.terminal) this.terminal.log('Password copied to clipboard', 'info');
                        window.TerminalUtils.showToast('Password copied!', 'success');
                    });
                }
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.genBtn.click();
            }
        });
    }

    charsetSize() {
        let size = 0;
        if (this.lowercase.checked) size += this.lowerChars.length;
        if (this.uppercase.checked) size += this.upperChars.length;
        if (this.numbers.checked) size += this.allNumbers.length;
        if (this.symbols.checked) size += this.allSymbols.length;
        return size;
    }

    generatePassword() {
        let allChars = "";
        if (this.lowercase.checked) allChars += this.lowerChars;
        if (this.uppercase.checked) allChars += this.upperChars;
        if (this.numbers.checked) allChars += this.allNumbers;
        if (this.symbols.checked) allChars += this.allSymbols;

        if (allChars.length === 0) {
            if (window.TerminalUtils) {
                window.TerminalUtils.showToast('Pick at least one character set', 'error');
            }
            return "";
        }

        const length = parseInt(this.inputSlider.value, 10);
        const out = new Array(length);

        // Use crypto RNG; reject values that would bias the modulo-mapping.
        const max = Math.floor(0xffffffff / allChars.length) * allChars.length;
        const buf = new Uint32Array(length * 2);
        let i = 0;
        while (i < length) {
            crypto.getRandomValues(buf);
            for (let j = 0; j < buf.length && i < length; j++) {
                if (buf[j] < max) {
                    out[i++] = allChars[buf[j] % allChars.length];
                }
            }
        }
        return out.join('');
    }

    updateStrength() {
        const length = parseInt(this.inputSlider.value, 10) || 0;
        const setSize = this.charsetSize();
        const bits = setSize > 0 ? Math.floor(length * Math.log2(setSize)) : 0;

        // Buckets roughly aligned to NIST/zxcvbn intuition.
        let level, label;
        if (bits < 28) { level = 'weak'; label = 'Weak'; }
        else if (bits < 60) { level = 'fair'; label = 'Fair'; }
        else if (bits < 100) { level = 'strong'; label = 'Strong'; }
        else { level = 'very-strong'; label = 'Very strong'; }

        if (this.strengthFill) {
            this.strengthFill.style.width = Math.min(100, (bits / 128) * 100) + '%';
            this.strengthFill.dataset.level = level;
        }
        if (this.strengthLabel) {
            this.strengthLabel.textContent = setSize === 0 ? 'No charset' : `${label} (~${bits} bits)`;
        }
    }

    initializeTerminal() {
        if (window.TerminalUtils && window.TerminalUtils.TerminalUI) {
            this.terminal = new window.TerminalUtils.TerminalUI('password-generator');
            this.terminal.log('Password Generator v2.0 initialized...', 'system');
            this.terminal.log('Configure options and click Generate.', 'info');
        }
    }
}

// Initialize the password generator
document.addEventListener('DOMContentLoaded', () => {
    new PasswordGenerator();
});