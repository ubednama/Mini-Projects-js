// Print Numbers Application
class PrintNumbers {
    constructor() {
        this.terminal = null;
        this.printButton = document.getElementById('print-btn');
        this.printArea = document.getElementById('print-area');
        this.input = document.getElementById('input');
        this.ascendingRadio = document.getElementById('ascending');
        this.descendingRadio = document.getElementById('descending');
        this.sortOrder = "ascending";

        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeTerminal();
    }

    initializeTerminal() {
        if (window.TerminalUtils && window.TerminalUtils.TerminalUI) {
            this.terminal = new window.TerminalUtils.TerminalUI('print-numbers');
            this.terminal.log('Number Printer v1.0 initialized...', 'system');
        }
    }

    bindEvents() {
        this.printButton.addEventListener('click', () => this.handlePrint());

        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handlePrint();
            }
        });

        this.ascendingRadio.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.sortOrder = "ascending";
                if (this.terminal) this.terminal.log('Sort order set to Ascending', 'info');
            }
        });

        this.descendingRadio.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.sortOrder = "descending";
                if (this.terminal) this.terminal.log('Sort order set to Descending', 'info');
            }
        });
    }

    handlePrint() {
        const inputNumber = parseInt(this.input.value);

        if (!isNaN(inputNumber)) {
            this.printArea.innerHTML = ''; // Clear previous content

            if (this.sortOrder === "ascending") {
                this.printAscending(inputNumber);
            } else {
                this.printDescending(inputNumber);
            }

            this.printArea.style.display = 'flex';

            if (this.terminal) {
                this.terminal.log(`Printed sequence starting from ${inputNumber} (${this.sortOrder})`, 'success');
            }
        } else {
            if (this.terminal) this.terminal.log('Error: Invalid number input', 'error');
            alert('Please enter a valid number.');
        }
    }

    printAscending(startingNumber) {
        const rows = [];
        for (let i = 0; i < 2; i++) {
            const row = document.createElement('div');
            row.classList.add('row');
            this.printArea.appendChild(row);
            rows.push(row);
        }

        let currentRowIndex = 0;
        for (let i = startingNumber; i < startingNumber + 6; i++) {
            const box = document.createElement('div');
            box.classList.add('box');
            box.textContent = i;
            rows[currentRowIndex].appendChild(box);
            if ((i - startingNumber + 1) % 3 === 0) {
                currentRowIndex++;
            }
        }
    }

    printDescending(startingNumber) {
        const rows = [];
        for (let i = 0; i < 2; i++) {
            const row = document.createElement('div');
            row.classList.add('row');
            this.printArea.appendChild(row);
            rows.push(row);
        }

        let currentRowIndex = 0;
        for (let i = startingNumber + 5; i >= startingNumber; i--) {
            const box = document.createElement('div');
            box.classList.add('box');
            box.textContent = i;
            rows[currentRowIndex].appendChild(box);
            if ((startingNumber + 5 - i + 1) % 3 === 0) {
                currentRowIndex++;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PrintNumbers();
});