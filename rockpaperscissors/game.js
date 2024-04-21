//game.js
let userScore = 0;
let compScore = 0;

const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");

const compScoreText = document.querySelector("#compScore");
const userScoreText = document.querySelector("#userScore");

const genCompChoice = () => {
    const options = ["rock", "paper", "scissors"];
    const randIdx = Math.floor(Math.random()*3);
    return options[randIdx];
}

const showWinner = (userWin,userChoice, compChoice) =>{
    if (userWin) {
        userScore++;
        console.log("You Won");
        msg.innerText = `You Won❤️!! your ${userChoice} beats ${compChoice}`;
        msg.style.backgroundColor = "green";
        userScoreText.innerText = userScore;
    }
    else {
        compScore++;
        console.log("You Lost");
        msg.innerText = `You Lost🤣 ${compChoice} beats your ${userChoice}`;
        msg.style.backgroundColor = "red";
        compScoreText.innerText = compScore;
    }
}

const drawGame = () => {
    console.log("Game is Draw");
    msg.innerText = "Draw... Play again";
    msg.style.backgroundColor = "#14110F";
}


//main game
const playGame = (userChoice) => {
    console.log("user Choice is ",userChoice);
    //Generate comp Choice\
    const compChoice = genCompChoice();
    console.log("comp Choice is ",compChoice);

    if(userChoice === compChoice) {
        //Draw Game
        drawGame();
    }
    else {
        let userWin = true;
        if(userChoice === 'rock') {
            userWin = compChoice === "paper" ? false: true;
        }
        else if (userChoice === "paper") {
            userWin = compChoice === "scissors" ? false : true;
        }
        else {
            userWin = compChoice === "rock" ? false : true;
        }
        showWinner(userWin, userChoice, compChoice);
    }
};

choices.forEach((choice) => {
    choice.addEventListener("click", () =>{
        const userChoice = choice.getAttribute('id');
        playGame(userChoice);
    });
});
    