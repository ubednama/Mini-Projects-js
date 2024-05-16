// select elements
let form = document.querySelector('form');
let word = document.querySelector('#word');
let resultContainer = document.querySelector('.result-container');
let result = document.querySelector('.result');

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    getData(word.value);
})

const getData = async (word) => {
    try {
        resultContainer.style.display = "block";
        result.innerHTML = "Searching...";
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await res.json();

        if (data.length > 0) {
            const wordData = data[0];
            let definitions = wordData.meanings[0].definitions[0];
        
            result.innerHTML = `<h2><strong>Word: </strong>${wordData.word}</h2>
            <p class="partsOfSpeech">${wordData.meanings[0].partOfSpeech}</p>
            <p><strong>Meaning: </strong>${definitions.definition === undefined ? "Not Found" : definitions.definition}</p>
            <p><strong>Example: </strong>${definitions.example === undefined ? "Not Found" : definitions.example}</p>
            <p><strong>Antonyms: </strong></p>`;
        
            if (definitions.antonyms.length === 0) {
                result.innerHTML += `<span>Not Found</span> <br>`;
            } else {
                for (let i = 0; i < definitions.antonyms.length; i++) {
                    result.innerHTML += `<li>${definitions.antonyms[i]}</li>`;
                }
            }
        
            if (wordData.phonetics.length === 0 || !wordData.phonetics[0].audio) {
                result.innerHTML += `<p>Audio Not Found</p>`;
            } else {
                for (let i = 0; i < wordData.phonetics.length; i++) {
                    const phonetic = wordData.phonetics[i];
                    if (phonetic.audio && phonetic.audio !== "") {
                        result.innerHTML += `Audio :  <audio controls>
                        <source src="${phonetic.audio}" type="audio/mpeg">
                        
                        Your browser does not support the audio tag.
                        </audio>`;
                    }
                }
            }
        
            result.innerHTML += `<div><a href="${wordData.sourceUrls[0]}" target="_blank">Read More</a></div>`;
        } else {
            result.innerHTML = "<p>Sorry, the word could not be found</p>";
        }
    }
    catch(e){
        result.innerHTML = "<p>Sorry, the word could not be found</p>";
    }
}
