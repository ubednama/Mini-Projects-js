// QR Code Generator
class QRCodeGenerator {
    constructor() {
        this.qrButton = document.querySelector("#qr-code");
        this.codeImage = document.querySelector("#code-img");
        this.loader = document.querySelector("#loading");
        this.input = document.querySelector("#input");
        this.toastContainer = document.querySelector("#toast-container");

        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Generate button
        this.qrButton.addEventListener('click', () => {
            const text = this.input.value;
            if (text) {
                this.generateQR(text);
            } else {
                this.showToast('Please enter text or URL', 'error');
            }
        });

        // Enter key in input
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const text = this.input.value;
                if (text) {
                    this.generateQR(text);
                } else {
                    this.showToast('Please enter text or URL', 'error');
                }
            }
        });

        // Global Enter key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && document.activeElement !== this.input) {
                const text = this.input.value;
                if (text) {
                    this.generateQR(text);
                } else {
                    this.showToast('Please enter text or URL', 'error');
                }
            }
        });
    }

    generateQR(text) {
        if (!text || text.trim() === "") {
            this.showToast('Please enter text or URL', 'error');
            this.codeImage.style.display = "none";
            return;
        }

        this.loader.classList.remove('hide');
        this.codeImage.classList.remove('active'); // Hide previous
        this.codeImage.style.display = 'none';

        const api = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(text)}`;

        // Setup load handler before setting src
        const img = new Image();
        img.onload = () => {
            this.loader.classList.add('hide');
            this.codeImage.src = api;
            this.codeImage.style.display = 'block';
            // Slight delay to allow display block to render before opacity transition
            setTimeout(() => {
                this.codeImage.classList.add('active');
            }, 50);
        };
        img.onerror = () => {
            this.loader.classList.add('hide');
            this.showToast('Failed to generate QR code', 'error');
        };
        img.src = api;
    }

    showToast(message, type = 'error') {
        if (window.TerminalUtils) {
            window.TerminalUtils.showToast(message, type);
        }
    }
}

// Initialize the QR code generator
document.addEventListener('DOMContentLoaded', () => {
    new QRCodeGenerator();
});