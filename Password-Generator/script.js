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
            
            // Get current settings for terminal command
            const length = this.inputSlider.value;
            const flags = [];
            if (this.lowercase.checked) flags.push('l');
            if (this.uppercase.checked) flags.push('U');
            if (this.numbers.checked) flags.push('N');
            if (this.symbols.checked) flags.push('@');
            
            const terminalCommand = `generate ${length} ${flags.join(' ')}`;
            
            // Log the equivalent terminal command
            this.addTerminalLine(terminalCommand, true);
            this.addTerminalLine(`Generated ${length}-character password with flags: ${flags.join(' ')}`);
        });

        // Copy functionality
        this.copyIcon.addEventListener("click", () => {
            if (this.passBox.value !== "") {
                navigator.clipboard.writeText(this.passBox.value).then(() => {
                    this.addTerminalLine('copy', true);
                    this.addTerminalLine('Password copied to clipboard');
                });
            }
        });

        // Settings change listeners for bidirectional sync
        [this.lowercase, this.uppercase, this.numbers, this.symbols].forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const settings = [];
                if (this.lowercase.checked) settings.push('lowercase');
                if (this.uppercase.checked) settings.push('uppercase');
                if (this.numbers.checked) settings.push('numbers');
                if (this.symbols.checked) settings.push('symbols');
                this.addTerminalLine(`Settings updated: ${settings.join(', ')}`);
            });
        });

        this.inputSlider.addEventListener('change', () => {
            this.addTerminalLine(`Password length set to ${this.inputSlider.value} characters`);
        });

        // Enter key support for generating password
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target !== document.querySelector('.cursor')) {
                // If focused on any password generator control, generate password
                if (e.target === this.inputSlider || 
                    e.target === this.lowercase || 
                    e.target === this.uppercase || 
                    e.target === this.numbers || 
                    e.target === this.symbols ||
                    e.target === this.genBtn) {
                    
                    e.preventDefault();
                    this.genBtn.click();
                }
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

    generatePasswordWithFlags(length, flags) {
        let allChars = "";
        
        // Parse flags
        const hasLower = flags.includes('l');
        const hasUpper = flags.includes('U');
        const hasNumbers = flags.includes('N');
        const hasSymbols = flags.includes('@');
        
        allChars += hasLower ? this.lowerChars : "";
        allChars += hasUpper ? this.upperChars : "";
        allChars += hasNumbers ? this.allNumbers : "";
        allChars += hasSymbols ? this.allSymbols : "";

        if (allChars === "") {
            return "";
        }

        let password = "";
        for (let i = 0; i < length; i++) {
            password += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }

        // Update UI to match generated password
        this.inputSlider.value = length;
        this.sliderValue.textContent = length;
        this.lowercase.checked = hasLower;
        this.uppercase.checked = hasUpper;
        this.numbers.checked = hasNumbers;
        this.symbols.checked = hasSymbols;

        return password;
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
            line.innerHTML = `<span class="prompt">user@password-gen:~$</span> <span class="command">${content}</span>`;
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
        const cmd = command.trim();
        
        // Parse generate command: generate 12 l U N @
        const generateMatch = cmd.match(/^generate\s+(\d+)(?:\s+([lUN@\s]+))?$/i);
        if (generateMatch) {
            const length = parseInt(generateMatch[1]);
            const flags = generateMatch[2] ? generateMatch[2].replace(/\s/g, '') : 'lU';
            
            if (length < 4 || length > 32) {
                return 'Password length must be between 4 and 32 characters';
            }
            
            const password = this.generatePasswordWithFlags(length, flags);
            if (password) {
                this.passBox.value = password;
                return `Generated ${length}-character password with flags: ${flags}`;
            } else {
                return 'No character types selected. Use flags: l(ower), U(pper), N(umbers), @(symbols)';
            }
        }
        
        // Other commands
        const commands = {
            'generate': () => {
                const password = this.generatePassword();
                this.passBox.value = password;
                return `Generated ${this.inputSlider.value}-character password`;
            },
            'copy': () => {
                if (this.passBox.value) {
                    navigator.clipboard.writeText(this.passBox.value);
                    return 'Password copied to clipboard';
                } else {
                    return 'No password to copy';
                }
            },
            'current': () => this.passBox.value || 'No password generated',
            'settings': () => {
                const settings = [];
                if (this.lowercase.checked) settings.push('lowercase');
                if (this.uppercase.checked) settings.push('uppercase');
                if (this.numbers.checked) settings.push('numbers');
                if (this.symbols.checked) settings.push('symbols');
                return `Length: ${this.inputSlider.value}, Types: ${settings.join(', ')}`;
            },
            'help': () => `Password Generator Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 PASSWORD GENERATION:
  generate               → Generate with current settings
  generate 12            → Generate 12-character password
  generate 16 l U N @    → Generate with specific flags

🔤 CHARACTER FLAGS:
  l                      → Include lowercase letters (a-z)
  U                      → Include uppercase letters (A-Z)  
  N                      → Include numbers (0-9)
  @                      → Include symbols (~!@#$%^&*)

📋 UTILITIES:
  copy                   → Copy current password to clipboard
  current                → Show current password
  settings               → Show current generator settings

🖥️  SYSTEM:
  help                   → Show this help message

💡 USAGE EXAMPLES:
  generate 8 l U         → 8 chars, letters only
  generate 16 l U N @    → 16 chars, all types
  generate 12 N @        → 12 chars, numbers + symbols

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        };
        
        const baseCommand = cmd.split(' ')[0].toLowerCase();
        if (commands[baseCommand]) {
            return commands[baseCommand]();
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
}

// Initialize the password generator
document.addEventListener('DOMContentLoaded', () => {
    new PasswordGenerator();
});