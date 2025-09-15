//currency converter API url
const BASE_URL =`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies`

const dropdowns = document.querySelectorAll(".dropdown select");

const btn = document.querySelector("form button");

const fromCurrSelect = document.querySelector("#from-select")
const toCurrSelect = document.querySelector("#to-select")

const msg = document.querySelector(".msg");

// Terminal integration functions
function getCurrentCursorLine() {
    return document.querySelector('.line:last-child .cursor');
}

function updateTerminalCursor(value) {
    const cursorLine = getCurrentCursorLine();
    if (cursorLine) {
        cursorLine.textContent = value + '_';
    }
}

function addTerminalLine(content, isCommand = false) {
    const terminalOutput = document.querySelector('.terminal-output');
    if (!terminalOutput) return;
    
    const line = document.createElement('div');
    line.className = 'line';
    
    if (isCommand) {
        line.innerHTML = `<span class="prompt">user@currency:~$</span> <span class="command">${content}</span>`;
    } else {
        line.innerHTML = `<span class="output">${content}</span>`;
    }
    
    // Insert before cursor line
    const cursorLine = terminalOutput.querySelector('.line:last-child');
    if (cursorLine && cursorLine.innerHTML.includes('cursor')) {
        terminalOutput.insertBefore(line, cursorLine);
    } else {
        terminalOutput.appendChild(line);
    }
    
    TerminalMessages.limitTerminalMessages();
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}



for(let select of dropdowns) {
    for (currCode in countryList) {

        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        if(select.name === "from" && currCode === "USD") {
            newOption.selected = "selected"
        } else if(select.name === "to" && currCode === "INR") {
            newOption.selected = "selected"
        }
        select.append(newOption);
    };
    select.addEventListener("change", (evt) =>{
        updateFlag(evt.target);
    });
};



//this will update country flag
const updateFlag = (element) => {
    // console.log(element);
    let currCode = element.value;
    console.log(currCode);
    let countryCode = countryList[currCode];
    let newScr = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newScr;
}




const updateExchRate = async() => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if(amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    const fromCurr = fromCurrSelect.value.toLowerCase();
    const toCurr = toCurrSelect.value.toLowerCase();

    // Show terminal command simulation
    if (window.terminalApp) {
        window.terminalApp.simulateCommand(
            `curl -s "${BASE_URL}/${fromCurr}.json" | jq '.${fromCurr}.${toCurr}'`,
            async () => {
                try {
                    const URL = `${BASE_URL}/${fromCurr}.json`;
                    let response = await fetch(URL);
                    let data = await response.json();
                    
                    let rate = data[fromCurr][toCurr];
                    let finalAmount = rate * amtVal;
                    let shortFinalAmount = finalAmount.toFixed(3);
                    
                    const result = `${amtVal} ${fromCurr.toUpperCase()} = ${shortFinalAmount} ${toCurr.toUpperCase()}`;
                    msg.innerText = result;
                    
                    // Add to terminal history
                    window.terminalApp.addToHistory(
                        `convert ${amtVal} ${fromCurr.toUpperCase()} to ${toCurr.toUpperCase()}`,
                        result,
                        'success'
                    );
                } catch (error) {
                    console.error('Currency conversion failed:', error);
                    msg.innerText = 'Error: Unable to fetch exchange rates';
                    
                    if (window.terminalApp) {
                        window.terminalApp.addToHistory(
                            `convert ${amtVal} ${fromCurr.toUpperCase()} to ${toCurr.toUpperCase()}`,
                            'Error: API request failed',
                            'error'
                        );
                    }
                }
            },
            800
        );
    } else {
        // Fallback without terminal simulation
        try {
            const URL = `${BASE_URL}/${fromCurr}.json`;
            let response = await fetch(URL);
            let data = await response.json();
            
            let rate = data[fromCurr][toCurr];
            let finalAmount = rate * amtVal;
            let shortFinalAmount = finalAmount.toFixed(3);
            
            msg.innerText = `${amtVal} ${fromCurr.toUpperCase()} = ${shortFinalAmount} ${toCurr.toUpperCase()}`;
        } catch (error) {
            console.error('Currency conversion failed:', error);
            msg.innerText = 'Error: Unable to fetch exchange rates';
        }
    }
};


// Swap functionality
const swapIcon = document.querySelector('.fa-arrow-right-arrow-left');
if (swapIcon) {
    swapIcon.addEventListener('click', () => {
        // Log command to terminal
        addTerminalLine('swap', true);
        
        // Get current values
        const fromValue = fromCurrSelect.value;
        const toValue = toCurrSelect.value;
        
        // Swap the values
        fromCurrSelect.value = toValue;
        toCurrSelect.value = fromValue;
        
        // Update flags
        updateFlag(fromCurrSelect);
        updateFlag(toCurrSelect);
        
        // Update exchange rate
        updateExchRate();
        
        // Add terminal message
        const terminalOutput = document.querySelector('.terminal-output');
        if (terminalOutput) {
            const line = document.createElement('div');
            line.className = 'line';
            line.innerHTML = `<span class="prompt">user@currency-converter:~$</span> <span class="command">Currencies swapped: ${toValue} ⇄ ${fromValue}</span>`;
            
            const cursorLine = terminalOutput.querySelector('.line:last-child');
            if (cursorLine && cursorLine.innerHTML.includes('cursor')) {
                terminalOutput.insertBefore(line, cursorLine);
            } else {
                terminalOutput.appendChild(line);
            }
            
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });
}

// Initialize and update exchange rate on load
window.addEventListener("load", ()=> {
    updateExchRate();
    
    // Update exchange rate when dropdowns change
    fromCurrSelect.addEventListener('change', updateExchRate);
    toCurrSelect.addEventListener('change', updateExchRate);
});

btn.addEventListener("click", (evt) =>{
    evt.preventDefault();
    const amount = document.querySelector(".amount input").value || 1;
    const from = fromCurrSelect.value;
    const to = toCurrSelect.value;
    
    addTerminalLine(`convert ${amount} ${from} to ${to}`, true);
    updateExchRate();
});

// Enter key support for form and inputs
const form = document.querySelector('form');
const amountInput = document.querySelector('.amount input');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    btn.click(); // Trigger the convert button
});

// Enter key support for amount input
amountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        btn.click();
    }
});

// Enter key support for dropdowns
[fromCurrSelect, toCurrSelect].forEach(select => {
    select.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            btn.click();
        }
    });
});

