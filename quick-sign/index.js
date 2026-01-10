// Quick Sign
const colorPicker = document.getElementById("color-picker");
const canvasColor = document.getElementById("canvas-color");
const canvas = document.getElementById("my-canvas");
const clearButton = document.getElementById("clear-button");
const saveButton = document.getElementById("download-button");
const retrieveButton = document.getElementById("retrieve-button");
const fontPicker = document.getElementById("font-picker");
const ctx = canvas.getContext("2d");

let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Initialize Canvas
function resizeCanvas() {
    // If we want a fixed canvas size logic, or responsive:
    // For now, let's keep the fixed size logic but ensure it fits
    // Or we could make it dynamic. Sticking to initial dimensions for simplicity 
    // but styles handle visual sizing.
    // If we want better resolution on high DPI screens:
    /*
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    */
    // For now, preserving defined width/height but ensuring background color is applied
    ctx.fillStyle = canvasColor.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Set initial background
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Event Listeners
colorPicker.addEventListener('change', (e) => {
    ctx.strokeStyle = e.target.value;
    ctx.fillStyle = e.target.value;
});

canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
});

canvas.addEventListener("mouseup", () => {
    isDrawing = false;
});

canvas.addEventListener("mouseout", () => {
    isDrawing = false;
});

// Touch support
canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    lastX = touch.clientX - rect.left;
    lastY = touch.clientY - rect.top;
});

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (isDrawing) {
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        lastX = x;
        lastY = y;
    }
});

canvas.addEventListener("touchend", () => {
    isDrawing = false;
});

// Controls
canvasColor.addEventListener('change', (e) => {
    ctx.fillStyle = e.target.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

fontPicker.addEventListener('change', (e) => {
    ctx.lineWidth = e.target.value;
});

clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Restore background
    ctx.fillStyle = canvasColor.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

saveButton.addEventListener('click', () => {
    localStorage.setItem('canvasContents', canvas.toDataURL());

    // Generate timestamp ddmmyyhhmm
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-11
    const year = String(now.getFullYear()).slice(-2); // Last 2 digits
    const hour = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');

    const timestamp = `${day}${month}${year}${hour}${min}`;
    const filename = `signature_${timestamp}.png`;

    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL();
    link.click();
});

retrieveButton.addEventListener("click", () => {
    let savedCanvas = localStorage.getItem("canvasContents");
    if (savedCanvas) {
        let img = new Image();
        img.src = savedCanvas;
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        }
    }
});

// Initial Setup
const init = () => {
    ctx.strokeStyle = colorPicker.value || "#000000";
    ctx.lineWidth = fontPicker.value || 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Set initial background again just to be sure
    ctx.fillStyle = canvasColor.value || "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};

init();