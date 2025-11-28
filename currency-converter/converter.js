// Currency Converter with Terminal Integration
const BASE_URL = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies`

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurrSelect = document.querySelector("#from-select")
const toCurrSelect = document.querySelector("#to-select")
const msg = document.querySelector(".msg");

let terminal = null;

// Populate Dropdowns
for (let select of dropdowns) {
    for (currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = "selected"
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected"
        }
        select.append(newOption);
    };
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
};

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newScr = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newScr;
}

const updateExchRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    const fromCurr = fromCurrSelect.value.toLowerCase();
    const toCurr = toCurrSelect.value.toLowerCase();

    if (terminal) terminal.log(`Converting ${amtVal} ${fromCurr.toUpperCase()} to ${toCurr.toUpperCase()}...`, 'info');

    try {
        const URL = `${BASE_URL}/${fromCurr}.json`;
        let response = await fetch(URL);
        let data = await response.json();

        let rate = data[fromCurr][toCurr];
        let finalAmount = rate * amtVal;
        let shortFinalAmount = finalAmount.toFixed(3);

        const result = `${amtVal} ${fromCurr.toUpperCase()} = ${shortFinalAmount} ${toCurr.toUpperCase()}`;
        msg.innerText = result;

        if (terminal) terminal.log(result, 'success');
    } catch (error) {
        msg.innerText = 'Error: Unable to fetch exchange rates';
        if (terminal) terminal.log('Error: API request failed', 'error');
    }
};

// Swap functionality
const swapIcon = document.querySelector('.fa-arrow-right-arrow-left');
if (swapIcon) {
    swapIcon.parentElement.addEventListener('click', () => {
        const fromValue = fromCurrSelect.value;
        const toValue = toCurrSelect.value;

        fromCurrSelect.value = toValue;
        toCurrSelect.value = fromValue;

        updateFlag(fromCurrSelect);
        updateFlag(toCurrSelect);
        updateExchRate();

        if (terminal) terminal.log(`Swapped currencies: ${toValue} ⇄ ${fromValue}`, 'info');
    });
}

// Initialize and update exchange rate on load
window.addEventListener("load", () => {
    updateExchRate();
});

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchRate();
});

// Initialize Terminal
document.addEventListener('DOMContentLoaded', () => {
    if (window.TerminalUtils && window.TerminalUtils.TerminalUI) {
        terminal = new window.TerminalUtils.TerminalUI('currency-converter');
        terminal.log('Currency Converter v2.0 initialized...', 'system');
    }
});
