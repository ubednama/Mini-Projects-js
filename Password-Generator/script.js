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
    }

    bindEvents() {
        // Slider value display
        this.inputSlider.addEventListener('input', () => {
            this.sliderValue.textContent = this.inputSlider.value;
        });

        // Generate button
        this.genBtn.addEventListener('click', () => {
            const password = this.generatePassword();
            this.passBox.value = password;

            // Log to terminal
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

        // Copy functionality
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

        // Enter key to generate
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.genBtn.click();
            }
        });
    }

    generatePassword() {
        let genPassword = "";
        let allChars = "";

        allChars += this.lowercase.checked ? this.lowerChars : "";
        allChars += this.uppercase.checked ? this.upperChars : "";
        allChars += this.numbers.checked ? this.allNumbers : "";
        allChars += this.symbols.checked ? this.allSymbols : "";

        if (allChars === "" || allChars.length === 0) {
            return genPassword;
        }

        for (let i = 0; i < this.inputSlider.value; i++) {
            genPassword += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }

        return genPassword;
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