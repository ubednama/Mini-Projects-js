// Print Numbers Application
class PrintNumbers {
    constructor() {
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
    }

    bindEvents() {
        this.printButton.addEventListener('click', () => this.handlePrint());

        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handlePrint();
            }
        });

        this.ascendingRadio.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.sortOrder = "ascending";
            }
        });

        this.descendingRadio.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.sortOrder = "descending";
            }
        });
    }

    handlePrint() {
        const inputNumber = parseInt(this.input.value, 10);

        if (Number.isNaN(inputNumber) || !Number.isFinite(inputNumber)) {
            this.toast('Please enter a valid number.');
            return;
        }

        const MIN = -9999;
        const MAX = 9999;
        if (inputNumber < MIN || inputNumber > MAX) {
            this.toast(`Number must be between ${MIN} and ${MAX}.`);
            return;
        }

        this.printArea.replaceChildren();

        if (this.sortOrder === "ascending") {
            this.printAscending(inputNumber);
        } else {
            this.printDescending(inputNumber);
        }

        this.printArea.style.display = 'flex';
    }

    toast(message) {
        if (window.TerminalUtils) {
            window.TerminalUtils.showToast(message, 'error');
        }
    }

    printAscending(startingNumber) {
        // Create 2 rows layout if needed, or just flow
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

            // Stagger animation
            box.style.animationDelay = `${(i - startingNumber) * 0.1}s`;

            if (rows[currentRowIndex]) {
                rows[currentRowIndex].appendChild(box);
            }

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
        let count = 0;
        for (let i = startingNumber + 5; i >= startingNumber; i--) {
            const box = document.createElement('div');
            box.classList.add('box');
            box.textContent = i;

            // Stagger animation
            box.style.animationDelay = `${count * 0.1}s`;
            count++;

            if (rows[currentRowIndex]) {
                rows[currentRowIndex].appendChild(box);
            }

            if ((startingNumber + 5 - i + 1) % 3 === 0) {
                currentRowIndex++;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PrintNumbers();
});