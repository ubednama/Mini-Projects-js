// QR Code Generator with Terminal Integration
class QRCodeGenerator {
    constructor() {
        this.qrButton = document.querySelector("#qr-code");
        this.codeImage = document.querySelector("#code-img");
        this.loader = document.querySelector("#loading");
        this.input = document.querySelector("#input");
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initializeTerminal();
    }

    bindEvents() {
        // Generate button
        this.qrButton.addEventListener('click', () => {
            const text = this.input.value;
            if (text) {
                // Log equivalent terminal command
                this.addTerminalLine(`qr-code "${text}"`, true);
                this.generateQR(text);
            } else {
                this.addTerminalLine('generate', true);
                this.addTerminalLine('Error: No text provided for QR generation');
            }
        });

        // Enter key in input
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const text = this.input.value;
                if (text) {
                    this.addTerminalLine(`qr-code "${text}"`, true);
                    this.generateQR(text);
                }
            }
        });

        // Input change listener for sync
        this.input.addEventListener('input', () => {
            // Optional: could log input changes for real-time sync
        });
    }

    generateQR(text) {
        if (!text || text.trim() === "") {
            this.addTerminalLine('Error: No text provided for QR generation');
            this.codeImage.style.display = "none";
            return;
        }

        this.loader.style.display = "block";
        this.codeImage.onload = () => {
            this.loader.style.display = "none";
            this.codeImage.style.display = "block";
            this.addTerminalLine(`QR code generated for: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
        }

        const api = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}`;
        this.codeImage.src = api;
    }

    downloadQR() {
        if (this.codeImage.src && this.codeImage.style.display !== "none") {
            const link = document.createElement('a');
            link.download = 'qr-code.png';
            link.href = this.codeImage.src;
            link.click();
            this.addTerminalLine('QR code downloaded as qr-code.png');
        } else {
            return 'No QR code to download. Generate one first.';
        }
    }

    clearQR() {
        this.codeImage.style.display = "none";
        this.codeImage.src = "";
        this.input.value = "";
        this.addTerminalLine('QR code cleared');
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
            line.innerHTML = `<span class="prompt">user@qr-generator:~$</span> <span class="command">${content}</span>`;
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
        
        // Parse qr-code command: qr-code "text here"
        const qrMatch = cmd.match(/^qr(?:-code)?\s+(.+)$/i);
        if (qrMatch) {
            const text = qrMatch[1].replace(/^["']|["']$/g, ''); // Remove quotes
            this.input.value = text;
            this.generateQR(text);
            return null;
        }
        
        // Other commands
        const commands = {
            'generate': () => {
                const text = this.input.value;
                if (text) {
                    this.generateQR(text);
                    return null;
                } else {
                    return 'No text in input field. Use: qr-code "your text here"';
                }
            },
            'download': () => this.downloadQR(),
            'clear': () => {
                this.clearQR();
                return null;
            },
            'current': () => {
                if (this.input.value) {
                    return `Current text: "${this.input.value}"`;
                } else {
                    return 'No text in input field';
                }
            },
            'help': () => `QR Code Generator Commands:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 QR CODE GENERATION:
  qr-code "text"         → Generate QR from text/URL
  qr "text"              → Short form of qr-code
  generate               → Generate from current input

💾 FILE OPERATIONS:
  download               → Download current QR as PNG
  clear                  → Clear QR code and input

📊 STATUS:
  current                → Show current input text

🖥️  SYSTEM:
  help                   → Show this help message

💡 USAGE EXAMPLES:
  qr-code "Hello World"  → Generate QR for text
  qr "https://github.com" → Generate QR for URL
  qr-code "My WiFi Pass" → Generate QR for WiFi password

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

// Initialize the QR code generator
document.addEventListener('DOMContentLoaded', () => {
    new QRCodeGenerator();
});