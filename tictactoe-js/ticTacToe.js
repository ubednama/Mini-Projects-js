// # tictactoe-js
let boxes = document.querySelectorAll(".box");
let resetButton = document.querySelector("#resetBtn");
let newGameBtn = document.querySelector("#newBtn");
let winMsg = document.querySelector("#msg")
let container = document.querySelector(".container");
let turn = document.querySelector("#turnMsg");
console.log();


const URL = "https://api.breakingbadquotes.xyz/v1/quotes";
// const URL = "https://cat-fact.herokuapp.com/facts";

const quoteText = document.querySelector("#quote");
const quoteAuthor = document.querySelector("#author");


const getQuotes = async () => {
    console.log("getting data....")
    let response = await fetch(URL);
    // console.log(response)       //JSON format
    let data = await response.json();
    console.log(data[0].quote);
    console.log(data[0].author);
    quoteText.innerText = data[0].quote;
    quoteAuthor.innerText = data[0].author;
};

(getQuotes())();


//playerX, playerO
let turnO = true;

const winPatterns = [
    [0,1,2],
    [0,4,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8],
];

const enableBoxes = () => {
    for(let box of boxes) {
        box.disabled = false;
        box.innerText="";
        winMsg.classList.add("hide");
        newGameBtn.classList.add("hide");
    }
    getQuotes();
};

const resetGame = () => {
    turnO = true;
    enableBoxes();
    count=0;
}

newGameBtn.addEventListener("click", () => {
    container.classList.remove("hide");
    enableBoxes();
    console.log("New game");
    count=0;
});

resetButton.addEventListener("click", () =>{
    enableBoxes();
    console.log("Game Reset.")
});

let count = 0;
boxes.forEach((box) => {
    box.addEventListener("click", () =>{
        console.log("Boxes were clicked");
        console.log(count);
        if(turnO) {
            turn.innerText ="X turn"
            box.innerText = "O"
            turnO = false;
            // count++;
        }
        else {
            turn.innerText ="O turn"
            box.innerText = "X";
            turnO = true;
            // count++;
        }
        box.disabled = true;
        count++;
        // checkWinner()
        let isWinner = checkWinner();

        if(count === 9 && !isWinner){
            showDraw()
        }
        else{
            checkWinner();
            console.log("line 77");
        };
    });
    
});


const disableBoxes = () => {
    for(let box of boxes) {
        box.disabled = true;
    }
}

const showWinner = (winner) => {
    winMsg.innerText = `Congratulations, Winner is "${winner}"`;
    disableBoxes();
    container.classList.add("hide");
    winMsg.classList.remove("hide");
    newGameBtn.classList.remove("hide");
};

const showDraw = () => {
    winMsg.innerText = `Game is Draw`;
    disableBoxes();
    container.classList.add("hide");
    winMsg.classList.remove("hide");
    newGameBtn.classList.remove("hide");
}




const checkWinner = () => {
    for(let pattern of winPatterns){                            //here we will index each winning patter
        // console.log(pattern);
        // console.log((boxes[pattern[0]]),
        // console.log(boxes[pattern[0]]),
        // console.log(boxes[pattern[0]]),
        // );
        let pos1Val = boxes[pattern[0]].innerText;              //here we will index value of each element of every wining pattern one by one
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if(pos1Val != "" && pos2Val != "" && pos3Val != "") {
            if(pos1Val === pos2Val && pos2Val === pos3Val) {
                // console.log("winner",pos1Val);
                showWinner(pos1Val);
                return true;
            };
        };
    };
};
