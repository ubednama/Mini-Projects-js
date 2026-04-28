// Currency Converter
const BASE_URL = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies`
const STORAGE_KEY = 'currency-converter-prefs-v1';

const dropdowns = document.querySelectorAll(".currency-selectors select");
const btn = document.querySelector(".btn-primary");
const fromCurrSelect = document.querySelector("#from-select")
const toCurrSelect = document.querySelector("#to-select")
const msg = document.querySelector(".result-msg");
const amountInput = document.querySelector(".amount-section input");
const toastContainer = document.querySelector("#toast-container");

const savedPrefs = (() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch (_) { return {}; }
})();

const savePrefs = () => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            from: fromCurrSelect.value,
            to: toCurrSelect.value,
            amount: amountInput.value,
        }));
    } catch (_) { /* ignore */ }
};

// Populate Dropdowns
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        const savedFrom = savedPrefs.from || 'USD';
        const savedTo = savedPrefs.to || 'INR';

        if (select.name === "from" && currCode === savedFrom) {
            newOption.selected = "selected"
        } else if (select.name === "to" && currCode === savedTo) {
            newOption.selected = "selected"
        }
        select.append(newOption);
    };
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
        savePrefs();
    });
};

if (savedPrefs.amount) amountInput.value = savedPrefs.amount;
amountInput.addEventListener('input', savePrefs);

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newScr = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newScr;
}

const showToast = (message, type = 'error') => {
    if (window.TerminalUtils) {
        window.TerminalUtils.showToast(message, type);
    }
};

const updateExchRate = async () => {
    let amtVal = amountInput.value;

    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amountInput.value = "1";
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

        msg.replaceChildren(
            document.createTextNode(result),
            document.createElement('br'),
            (() => {
                const span = document.createElement('span');
                span.className = 'unit-rate';
                span.textContent = unitRate;
                return span;
            })()
        );

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
        savePrefs();
        updateExchRate();
    });
}

// Initialize: sync flags with saved selections, then fetch rate.
window.addEventListener("load", () => {
    updateFlag(fromCurrSelect);
    updateFlag(toCurrSelect);
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
