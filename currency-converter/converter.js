//currency converter API url
const BASE_URL =`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies`

const dropdowns = document.querySelectorAll(".dropdown select");

const btn = document.querySelector("form button");

const fromCurrSelect = document.querySelector(".from select")         //class -> from, tagmane -> select
const toCurrSelect = document.querySelector(".to select")             //class -> from, tagmane -> select

const msg = document.querySelector(".msg");



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
    let amtVal= amount.value;

    if(amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    const fromCurr = fromCurrSelect.value.toLowerCase();
    const toCurr = toCurrSelect.value.toLowerCase()

    const URL = `${BASE_URL}/${fromCurr}.json`;
    // console.log(URL)

    let response = await fetch(URL);
    let data = await response.json();
    // console.log("data ",data);

    let rate = data[fromCurr][toCurr];
    // console.log(rate);

    let finalAmount = rate * amount.value;
    let shortFinalAmount = finalAmount.toFixed(3);
    // console.log(finalAmount);

    msg.innerText = `${amount.value} ${fromCurr.toUpperCase()} is around ${shortFinalAmount} ${toCurr.toUpperCase()}`;
};


//dont use document here
window.addEventListener("load", ()=>{
    updateExchRate();
});

btn.addEventListener("click", (evt) =>{
    evt.preventDefault();
    updateExchRate();
});

