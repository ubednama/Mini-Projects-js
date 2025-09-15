const circleCoor = [];

function checkIntersection() {
    const circle1 = circleCoor[0];
    const circle2 = circleCoor[1];

    const x1 = circle1.x
    const y1 = circle1.y
    const r1 = circle1.r
    
    const x2 = circle2.x
    const y2 = circle2.y
    const r2 = circle2.r

    return Math.hypot(x1-x2, y1-y2) <= r1+r2
}

function addTerminalMessage(message) {
    const terminalOutput = document.querySelector('.terminal-output');
    if (terminalOutput) {
        const line = document.createElement('div');
        line.className = 'line';
        line.innerHTML = `<span class="prompt">user@circle-game:~$</span> <span class="command">${message}</span>`;
        
        const cursorLine = terminalOutput.querySelector('.line:last-child');
        if (cursorLine && cursorLine.innerHTML.includes('cursor')) {
            terminalOutput.insertBefore(line, cursorLine);
        } else {
            terminalOutput.appendChild(line);
        }
        
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
}

document.addEventListener('click', (e) => {
    const gameContainer = document.querySelector('.game-container');
    if (!gameContainer) return;
    
    // Check if click was inside game container
    const rect = gameContainer.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || 
        e.clientY < rect.top || e.clientY > rect.bottom) {
        return;
    }
    
    const allCircles = document.querySelectorAll(".circle");
    const messageDiv = document.querySelector(".message")
    
    if(allCircles.length === 2){
        // Clear existing circles and reset
        allCircles.forEach(circles => {
            gameContainer.removeChild(circles)
        })
        if (messageDiv) {
            gameContainer.removeChild(messageDiv)
        }
        circleCoor.length = 0; // Clear array
        addTerminalMessage("Screen reset - ready for new circles");
        return;
    }

    // Calculate position relative to game container
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const randomRadius = Math.random() * 50 + 20; // 20-70px radius
    circleCoor.push({x, y, r: randomRadius})
    
    const circle = document.createElement('div');
    circle.classList.add('circle')
    circle.style.position = 'absolute';
    circle.style.top = (y - randomRadius) + "px"
    circle.style.left = (x - randomRadius) + 'px'
    circle.style.width = (randomRadius * 2) + 'px'
    circle.style.height = (randomRadius * 2) + 'px'
    circle.style.borderRadius = '50%';
    circle.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
    circle.style.border = '2px solid var(--accent-color)';
    circle.style.opacity = '0.8';

    gameContainer.appendChild(circle)
    
    addTerminalMessage(`Circle ${circleCoor.length} created at (${Math.round(x)}, ${Math.round(y)}) with radius ${Math.round(randomRadius)}px`);

    if(circleCoor.length === 2){
        const intersects = checkIntersection();
        const message = document.createElement('div');
        message.classList.add('message')
        message.style.position = 'absolute';
        message.style.bottom = '20px';
        message.style.left = '50%';
        message.style.transform = 'translateX(-50%)';
        message.style.color = intersects ? 'var(--error-color)' : 'var(--success-color)';
        message.style.fontWeight = 'bold';
        message.style.background = 'var(--bg-card)';
        message.style.padding = '10px 20px';
        message.style.borderRadius = 'var(--radius-sm)';
        message.style.border = '1px solid var(--border-color)';
        message.innerHTML = intersects ? 'Circles Overlap!' : 'Circles Don\'t Overlap';
        gameContainer.appendChild(message);
        
        addTerminalMessage(intersects ? "Circles overlap detected!" : "Circles don't overlap");
        addTerminalMessage("Click anywhere to reset and draw new circles");
    }
})