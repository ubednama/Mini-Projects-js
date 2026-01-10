// Calculator with Terminal Integration
const myInput = document.getElementById("myInput");
const allowedOperators = ['/', '*', '-', '+', '.', '%'];
let isError = false;
let lastPressedKey = null;
let currentExpression = '';
let terminal = null;

// Initialize Terminal
document.addEventListener('DOMContentLoaded', () => {
    if (window.TerminalUtils && window.TerminalUtils.TerminalUI) {
        terminal = new window.TerminalUtils.TerminalUI('calculator');
        terminal.log('Calculator v4.0 initialized...', 'system');
        terminal.log('Ready for calculations.', 'info');
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            assign('=');
        } else if (['/', '*', '-', '+', '.', '%'].includes(e.key)) {
            assign(e.key);
        } else if (e.key >= '0' && e.key <= '9') {
            assign(e.key);
        } else if (e.key === 'Backspace') {
            assign('DEL');
        } else if (e.key === 'Escape') {
            assign('AC');
        }
    });
});

// Main assign function - handles both UI and terminal sync
function assign(value) {
    if (isError) {
        clearInput();
        isError = false;
    }

    if (value === 'AC') {
        clearInput();
        return;
    }

    if (value === 'DEL') {
        del();
        return;
    }

    if (value === '=') {
        calculate();
        return;
    }

    let newValue;
    if (myInput.value === '0' || myInput.value === '') {
        newValue = value;
    } else if (allowedOperators.includes(value) && allowedOperators.includes(lastPressedKey)) {
        newValue = myInput.value.slice(0, -1) + value;
    } else {
        newValue = myInput.value + value;
    }

    myInput.value = newValue;
    currentExpression = newValue;
    lastPressedKey = value;
}

function clearInput() {
    myInput.value = '';
    currentExpression = '';
    if (terminal) terminal.log('Calculator cleared', 'system');
}

function del() {
    const newValue = myInput.value.slice(0, -1);
    myInput.value = newValue;
    currentExpression = newValue;
}

function calculate() {
    const expression = myInput.value;

    try {
        // Basic security check
        if (/[^0-9+\-*/.()%]/.test(expression)) {
            throw new Error("Invalid characters");
        }

        // Handle percentage
        let evalExpression = expression.replace(/%/g, '/100');

        const result = eval(evalExpression);

        // Format result to avoid long decimals
        const formattedResult = parseFloat(result.toFixed(8));

        myInput.value = formattedResult;
        currentExpression = '';

        // Log full expression to terminal
        if (terminal) terminal.log(`${expression} = ${formattedResult}`, 'success');
    } catch (e) {
        myInput.value = 'ERROR';
        isError = true;
        currentExpression = '';

        if (terminal) terminal.log(`Error: ${expression}`, 'error');
    }
}