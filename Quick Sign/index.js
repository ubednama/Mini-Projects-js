const colorPicker = document.getElementById('color-picker')
const canvasColor = document.getElementById('canvas-color')
const fontSize = document.getElementById('font-picker')

const canvas = document.getElementById('my-canvas')

const clearButton = document.getElementById('clear-button')
const downloadButton = document.getElementById('download-button')
const retrieveButton = document.getElementById('retrieve-button')

const ctx = canvas.getContext('2d')

colorPicker.addEventListener('change', (e) => {
    ctx.strokeStyle = e.target.value;
    ctx.fillStyle = e.target.value;
})

canvas.addEventListener('mousedown', (e)=> {
    isDrawing = true;
    lastX= event.offsetX;
    lastY = event.offsetY;
})

canvas.addEventListener('mousemove', (e)=> {
    if(isDrawing){
        ctx.beginPath()
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();

        lastX = event.offsetX
        lastY = event.offsetY
    }
})

canvas.addEventListener('mouseup', ()=> {
    isDrawing = false
})

canvasColor.addEventListener('change', (e)=> {
    ctx.fillStyle = e.target.value;
    ctx.fillRect(0,0,canvas.width, canvas.height)
})

fontSize.addEventListener('change', (e)=> {
    ctx.lineWidth = e.target.value
})

clearButton.addEventListener('click', ()=>{
    ctx.clearRect(0,0,canvas.width, canvas.height)
})

downloadButton.addEventListener('click', (e)=> {
    localStorage.setItem('canvasContent',canvas.toDataURL());

    let link = document.createElement('a');

    link.download = 'my-canvas.png';

    link.href = canvas.toDataURL();

    link.click();
})

retrieveButton.addEventListener('click', (e)=> {
    // Retrieve the saved canvas contents from local storage
    let savedCanvas = localStorage.getItem('canvasContent');

    if (savedCanvas) {
        let img = new Image();
        img.src = savedCanvas;
        ctx.drawImage(img, 0, 0);
    }
})