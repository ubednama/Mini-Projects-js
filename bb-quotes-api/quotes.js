//Breaking Bad Quotes API
const URL = "https://api.breakingbadquotes.xyz/v1/quotes";
// const URL = "https://cat-fact.herokuapp.com/facts";

const quoteText = document.querySelector("#quote");
const quoteAuthor = document.querySelector("#author");


const getFacts = async () => {
    console.log("getting data....")
    let response = await fetch(URL);
    // console.log(response)       //JSON format
    let data = await response.json();
    console.log(data[0].quote);
    console.log(data[0].author);
    quoteText.innerText = data[0].quote;
    quoteAuthor.innerText = data[0].author;
};

getFacts();