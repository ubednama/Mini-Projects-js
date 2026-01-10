// Currency Converter
const BASE_URL = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies`

const dropdowns = document.querySelectorAll(".currency-selectors select");
const btn = document.querySelector(".btn-primary");
const fromCurrSelect = document.querySelector("#from-select")
const toCurrSelect = document.querySelector("#to-select")
const msg = document.querySelector(".result-msg");
const toastContainer = document.querySelector("#toast-container");

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

const showToast = (message, type = 'error') => {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;

    toastContainer.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3000);
}

const updateExchRate = async () => {
    let amount = document.querySelector(".amount-section input");
    let amtVal = amount.value;

    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    const fromCurr = fromCurrSelect.value.toLowerCase();
    const toCurr = toCurrSelect.value.toLowerCase();

    try {
        const URL = `${BASE_URL}/${fromCurr}.json`;
        let response = await fetch(URL);
        if (!response.ok) throw new Error("Network response was not ok");
        let data = await response.json();

        let rate = data[fromCurr][toCurr];
        let finalAmount = rate * amtVal;
        let shortFinalAmount = finalAmount.toFixed(3);

        const result = `${amtVal} ${fromCurr.toUpperCase()} = ${shortFinalAmount} ${toCurr.toUpperCase()}`;
        const unitRate = `1 ${fromCurr.toUpperCase()} = ${rate} ${toCurr.toUpperCase()}`;

        msg.innerHTML = `${result}<br><span style="font-size: 0.8rem; opacity: 0.7; margin-top: 5px; display: block;">${unitRate}</span>`;

    } catch (error) {
        msg.innerText = 'Conversion failed';
        showToast('Error: Unable to fetch exchange rates. Please check your connection.', 'error');
    }
};

// Swap functionality
const swapIcon = document.querySelector('.swap-icon');
if (swapIcon) {
    swapIcon.addEventListener('click', () => {
        const fromValue = fromCurrSelect.value;
        const toValue = toCurrSelect.value;

        fromCurrSelect.value = toValue;
        toCurrSelect.value = fromValue;

        updateFlag(fromCurrSelect);
        updateFlag(toCurrSelect);
        updateExchRate();
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

window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        updateExchRate();
    }
});
