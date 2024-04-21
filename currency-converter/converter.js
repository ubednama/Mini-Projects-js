//currency converter API url
const BASE_URL =`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies`

const dropdowns = document.querySelectorAll(".dropdown select");

const btn = document.querySelector("form button");

const fromCurr = document.querySelector(".from select")         //class -> from, tagmane -> select
const toCurr = document.querySelector(".to select")             //class -> from, tagmane -> select

const msg = document.querySelector(".msg");



for(let select of dropdowns) {
    for (currCode in countryList) {
        // console.log(currCode, countryList[currCode]);
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
    // console.log(amount);
    // console.log(amtVal);
    if(amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }
    // console.log(amtVal);

    // console.log(fromCurr, toCurr.value);
        /*  toCurr.value -> gives just value of 'to currency' */
    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toLowerCase()}.json`;
    let response = await fetch(URL);
    let data = await response.json();
    console.log(data);
    let rate = data[toCurr.value.toLowerCase()];
    console.log(rate);
    let finalAmount = rate * amount.value;
    let shortFinalAmount = finalAmount.toFixed(3);
    console.log(finalAmount);
    msg.innerText = `${amount.value} ${fromCurr.value} is around ${shortFinalAmount} ${toCurr.value}`;
};


//dont use document here
window.addEventListener("load", ()=>{
    updateExchRate();
});

btn.addEventListener("click", (evt) =>{
    evt.preventDefault();
    updateExchRate();
});

