// Quick Sign Application
class QuickSign {
    constructor() {
        this.terminal = null;
        this.colorPicker = document.getElementById('color-picker');
        this.canvasColor = document.getElementById('canvas-color');
        this.fontSize = document.getElementById('font-picker');
        this.canvas = document.getElementById('my-canvas');
        this.clearButton = document.getElementById('clear-button');
        this.downloadButton = document.getElementById('download-button');
        this.retrieveButton = document.getElementById('retrieve-button');
        this.ctx = this.canvas.getContext('2d');

        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;

        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeTerminal();
        // Set initial canvas background
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    initializeTerminal() {
        if (window.TerminalUtils && window.TerminalUtils.TerminalUI) {
            this.terminal = new window.TerminalUtils.TerminalUI('quick-sign');
            this.terminal.log('Quick Sign v2.0 initialized...', 'system');
            this.terminal.log('Canvas drawing engine ready', 'success');
        }
    }

    bindEvents() {
        this.colorPicker.addEventListener('change', (e) => {
            this.ctx.strokeStyle = e.target.value;
            this.ctx.fillStyle = e.target.value;
            if (this.terminal) this.terminal.log(`Pen color changed to ${e.target.value}`, 'info');
        });

        this.canvas.addEventListener('mousedown', (e) => {
            this.isDrawing = true;
            this.lastX = e.offsetX;
            this.lastY = e.offsetY;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDrawing) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.lastX, this.lastY);
                this.ctx.lineTo(e.offsetX, e.offsetY);
                this.ctx.stroke();

                this.lastX = e.offsetX;
                this.lastY = e.offsetY;
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDrawing = false;
        });

        this.canvas.addEventListener('mouseout', () => {
            this.isDrawing = false;
        });

        this.canvasColor.addEventListener('change', (e) => {
            this.ctx.fillStyle = e.target.value;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            if (this.terminal) this.terminal.log(`Background color changed to ${e.target.value}`, 'info');
        });

        this.fontSize.addEventListener('change', (e) => {
            this.ctx.lineWidth = e.target.value;
            if (this.terminal) this.terminal.log(`Pen size set to ${e.target.value}px`, 'info');
        });

        this.clearButton.addEventListener('click', () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // Reset background to white or selected color
            this.ctx.fillStyle = this.canvasColor.value;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            if (this.terminal) this.terminal.log('Canvas cleared', 'warning');
        });

        this.downloadButton.addEventListener('click', () => {
            localStorage.setItem('canvasContent', this.canvas.toDataURL());

            let link = document.createElement('a');
            link.download = 'signature.png';
            link.href = this.canvas.toDataURL();
            link.click();

            if (this.terminal) this.terminal.log('Signature downloaded as signature.png', 'success');
        });

        this.retrieveButton.addEventListener('click', () => {
            let savedCanvas = localStorage.getItem('canvasContent');

            if (savedCanvas) {
                let img = new Image();
                img.src = savedCanvas;
                img.onload = () => {
                    this.ctx.drawImage(img, 0, 0);
                    if (this.terminal) this.terminal.log('Previous signature retrieved', 'success');
                };
            } else {
                if (this.terminal) this.terminal.log('No saved signature found', 'error');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new QuickSign();
});