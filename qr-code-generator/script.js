// QR Code Generator
class QRCodeGenerator {
    constructor() {
        this.qrButton = document.querySelector("#qr-code");
        this.codeImage = document.querySelector("#code-img");
        this.copyButton = document.querySelector("#copy-text");
        this.downloadButton = document.querySelector("#download-qr");
        this.resetButton = document.querySelector("#reset-qr");
        this.loader = document.querySelector("#loading");
        this.input = document.querySelector("#input");
        this.toastContainer = document.querySelector("#toast-container");
        this.lastEncoded = '';

        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const submit = () => {
            const text = this.input.value.trim();
            if (text) {
                this.generateQR(text);
            } else {
                this.showToast('Please enter text or URL', 'error');
            }
        };

        this.qrButton.addEventListener('click', submit);

        if (window.TerminalUtils && window.TerminalUtils.onEnter) {
            window.TerminalUtils.onEnter(this.input, submit);
        } else {
            this.input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); submit(); }
            });
        }

        if (this.copyButton) {
            this.copyButton.addEventListener('click', () => this.copyEncoded());
        }
        if (this.downloadButton) {
            this.downloadButton.addEventListener('click', () => this.downloadQR());
        }
        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => this.reset());
        }
    }

    reset() {
        this.input.value = '';
        this.lastEncoded = '';
        this.codeImage.src = '';
        this.codeImage.classList.remove('active');
        this.codeImage.style.display = 'none';
        this.copyButton?.classList.add('hide');
        this.downloadButton?.classList.add('hide');
        this.resetButton?.classList.add('hide');
        this.input.focus();
    }

    generateQR(text) {
        const trimmed = text.trim();
        if (!trimmed) {
            this.showToast('Please enter text or URL', 'error');
            this.codeImage.style.display = "none";
            this.copyButton?.classList.add('hide');
            this.downloadButton?.classList.add('hide');
            this.resetButton?.classList.add('hide');
            return;
        }

        this.loader.classList.remove('hide');
        this.codeImage.classList.remove('active');
        this.codeImage.style.display = 'none';
        this.copyButton?.classList.add('hide');
        this.downloadButton?.classList.add('hide');
        this.resetButton?.classList.add('hide');

        const api = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(trimmed)}`;

        const img = new Image();
        img.onload = () => {
            this.loader.classList.add('hide');
            this.codeImage.src = api;
            this.codeImage.style.display = 'block';
            this.lastEncoded = trimmed;
            this.copyButton?.classList.remove('hide');
            this.downloadButton?.classList.remove('hide');
            this.resetButton?.classList.remove('hide');
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

    async downloadQR() {
        if (!this.lastEncoded) return;
        try {
            const api = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(this.lastEncoded)}`;
            const response = await fetch(api);
            if (!response.ok) throw new Error('fetch failed');
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `qr-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            this.showToast('Download failed', 'error');
        }
    }

    copyEncoded() {
        if (!this.lastEncoded || !window.TerminalUtils) return;
        window.TerminalUtils.copyToClipboard(
            this.lastEncoded,
            () => this.showToast('Copied to clipboard', 'success'),
            () => this.showToast('Copy failed', 'error'),
        );
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