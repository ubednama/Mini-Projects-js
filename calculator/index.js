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
        if (/[^0-9+\-*/.()%\s]/.test(expression)) {
            throw new Error("Invalid characters");
        }

        const result = evaluateExpression(expression.replace(/%/g, '/100'));

        if (!Number.isFinite(result)) {
            throw new Error("Math error");
        }

        const formattedResult = parseFloat(result.toFixed(8));
        myInput.value = formattedResult;
        currentExpression = '';

        if (terminal) terminal.log(`${expression} = ${formattedResult}`, 'success');
    } catch (e) {
        myInput.value = 'ERROR';
        isError = true;
        currentExpression = '';

        if (terminal) terminal.log(`Error: ${expression}`, 'error');
    }
}

// Recursive-descent expression evaluator — replaces eval().
// Grammar: expr → term (('+'|'-') term)* ; term → factor (('*'|'/') factor)* ;
//          factor → number | '(' expr ')' | ('-'|'+') factor
function evaluateExpression(input) {
    let pos = 0;
    const src = input;

    function peek() {
        while (pos < src.length && src[pos] === ' ') pos++;
        return src[pos];
    }

    function consume() {
        const c = peek();
        pos++;
        return c;
    }

    function parseNumber() {
        let start = pos;
        while (pos < src.length && /[0-9.]/.test(src[pos])) pos++;
        const num = parseFloat(src.slice(start, pos));
        if (Number.isNaN(num)) throw new Error("Bad number");
        return num;
    }

    function parseFactor() {
        const c = peek();
        if (c === '(') {
            consume();
            const value = parseExpr();
            if (peek() !== ')') throw new Error("Missing )");
            consume();
            return value;
        }
        if (c === '-') { consume(); return -parseFactor(); }
        if (c === '+') { consume(); return parseFactor(); }
        if (c === undefined || !/[0-9.]/.test(c)) throw new Error("Unexpected token");
        return parseNumber();
    }

    function parseTerm() {
        let value = parseFactor();
        while (peek() === '*' || peek() === '/') {
            const op = consume();
            const rhs = parseFactor();
            if (op === '*') value *= rhs;
            else {
                if (rhs === 0) throw new Error("Division by zero");
                value /= rhs;
            }
        }
        return value;
    }

    function parseExpr() {
        let value = parseTerm();
        while (peek() === '+' || peek() === '-') {
            const op = consume();
            const rhs = parseTerm();
            value = op === '+' ? value + rhs : value - rhs;
        }
        return value;
    }

    const result = parseExpr();
    if (pos < src.length && peek() !== undefined) throw new Error("Trailing input");
    return result;
}