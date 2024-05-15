const item0 = document.getElementById("item0");
const myInput = document.getElementById("myInput");
const allowedOperators = ['/', '*', '-', '+', '.'];
let isEnterPressed = false;
let isError = false;
let lastPressedKey = null;


function assign(value) {
    if (isError) {
        clearInput();
        isError = false;
    }

    if (myInput.value === '0')
        myInput.value = value;

    else if (allowedOperators.includes(value) && allowedOperators.includes(lastPressedKey))
        myInput.value = myInput.value.slice(0, -1) + value;
    else
        myInput.value += value;

    lastPressedKey = value;
}



function clearInput() {
    myInput.value = '';
}

function del() {
    myInput.value = myInput.value.slice(0, -1);
}


function calculate() {
    try {
        myInput.value = eval(myInput.value);
    }
    catch {
        myInput.value = 'ERROR';
        isError = true;
    }
    isEnterPressed = true;
}



function checkoperators(value) {

    return allowedOperators.indexOf(value) > -1 ||
        (value >= 0 && value <= 9);
}

document.body.addEventListener("keydown", (value) => {
    if (document.activeElement)
        document.activeElement.blur();
    const button = document.querySelector(`button[value='${value.key}']`);

    if (isEnterPressed && value.key === '0') {
        clearInput();
    }
    isEnterPressed = false;

    if (value.key === 'Enter') {
        calculate();
    }

    else if (value.key === 'Backspace')
        del();

    else if (checkoperators(value.key))
        assign(value.key);


    if (button) {
        console.log("trigger");
        button.classList.add('active');
        setTimeout(() => {
            button.classList.remove('active');
        }, 10);
    }

});