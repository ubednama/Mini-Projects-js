document.addEventListener("DOMContentLoaded", function() {
    const printButton = document.querySelector('.input button');
    const printContainer = document.querySelector('.print');
    let sortOrder = "ascending"; // Default sort order
    
    // Function to print numbers in ascending order
    function printAscending(startingNumber) {
        const rows = [];
        for (let i = 0; i < 2; i++) {
            const row = document.createElement('div');
            row.classList.add('row');
            printContainer.appendChild(row);
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
    
    // Function to print numbers in descending order
    function printDescending(startingNumber) {
        const rows = [];
        for (let i = 0; i < 2; i++) {
            const row = document.createElement('div');
            row.classList.add('row');
            printContainer.appendChild(row);
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
    
    // Event listener for the Print button
    printButton.addEventListener('click', function() {
        const inputNumber = parseInt(document.getElementById('input').value);
        
        if (!isNaN(inputNumber)) {
            printContainer.innerHTML = ''; // Clear previous content
            
            if (sortOrder === "ascending") {
                printAscending(inputNumber);
            } else {
                printDescending(inputNumber);
            }

            // Show the print container after printing
            printContainer.style.display = 'flex';
        } else {
            alert('Please enter a valid number.');
        }
    });
    
    // Event listener for radio buttons to change the sort order
    const ascendingRadio = document.getElementById('ascending');
    const descendingRadio = document.getElementById('descending');
    
    ascendingRadio.addEventListener('change', function() {
        if (this.checked) {
            sortOrder = "ascending";
        }
    });
    
    descendingRadio.addEventListener('change', function() {
        if (this.checked) {
            sortOrder = "descending";
        }
    });
});