// QR Code Generator with Terminal Integration
class QRCodeGenerator {
    constructor() {
        this.terminal = null;
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

    initializeTerminal() {
        if (window.TerminalUtils && window.TerminalUtils.TerminalUI) {
            this.terminal = new window.TerminalUtils.TerminalUI('qr-generator');
            this.terminal.log('QR Code Generator v3.0 initialized...', 'system');
        }
    }

    bindEvents() {
        // Generate button
        this.qrButton.addEventListener('click', () => {
            const text = this.input.value;
            if (text) {
                this.generateQR(text);
            } else {
                if (this.terminal) this.terminal.log('Error: No text provided for QR generation', 'error');
            }
        });

        // Enter key in input
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const text = this.input.value;
                if (text) {
                    this.generateQR(text);
                }
            }
        });
    }

    generateQR(text) {
        if (!text || text.trim() === "") {
            if (this.terminal) this.terminal.log('Error: No text provided for QR generation', 'error');
            this.codeImage.style.display = "none";
            return;
        }

        this.loader.style.display = "block";
        this.codeImage.onload = () => {
            this.loader.style.display = "none";
            this.codeImage.style.display = "block";
            if (this.terminal) this.terminal.log(`Generated QR code for: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`, 'success');
        }

        const api = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}`;
        this.codeImage.src = api;
    }
}

// Initialize the QR code generator
document.addEventListener('DOMContentLoaded', () => {
    new QRCodeGenerator();
});