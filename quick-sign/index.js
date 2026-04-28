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

// Convert pointer event to canvas-bitmap coordinates so drawing stays aligned
// when CSS scales the canvas (responsive layouts, mobile).
function getPointerPos(evt) {
    const rect = canvas.getBoundingClientRect();
    const source = evt.touches ? evt.touches[0] : evt;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (source.clientX - rect.left) * scaleX,
        y: (source.clientY - rect.top) * scaleY,
    };
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
    const { x, y } = getPointerPos(e);
    lastX = x;
    lastY = y;
});

canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;
    const { x, y } = getPointerPos(e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastX = x;
    lastY = y;
});

canvas.addEventListener("mouseup", () => { isDrawing = false; });
canvas.addEventListener("mouseout", () => { isDrawing = false; });

canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    isDrawing = true;
    const { x, y } = getPointerPos(e);
    lastX = x;
    lastY = y;
}, { passive: false });

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const { x, y } = getPointerPos(e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastX = x;
    lastY = y;
}, { passive: false });

canvas.addEventListener("touchend", () => { isDrawing = false; });
canvas.addEventListener("touchcancel", () => { isDrawing = false; });

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