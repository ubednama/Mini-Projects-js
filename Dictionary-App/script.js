// select elements
let form = document.querySelector('form');
let word = document.querySelector('#word');
let resultContainer = document.querySelector('.result-container');
let result = document.querySelector('.result');

// Terminal integration functions
function getCurrentCursorLine() {
    return document.querySelector('.line:last-child .cursor');
}

function updateTerminalCursor(value) {
    const cursorLine = getCurrentCursorLine();
    if (cursorLine) {
        cursorLine.textContent = value + '_';
    }
}

function addTerminalLine(content, isCommand = false) {
    const terminalOutput = document.querySelector('.terminal-output');
    if (!terminalOutput) return;
    
    const line = document.createElement('div');
    line.className = 'line';
    
    if (isCommand) {
        line.innerHTML = `<span class="prompt">user@dictionary:~$</span> <span class="command">${content}</span>`;
    } else {
        line.innerHTML = `<span class="output">${content}</span>`;
    }
    
    // Insert before cursor line
    const cursorLine = terminalOutput.querySelector('.line:last-child');
    if (cursorLine && cursorLine.innerHTML.includes('cursor')) {
        terminalOutput.insertBefore(line, cursorLine);
    } else {
        terminalOutput.appendChild(line);
    }
    
    TerminalMessages.limitTerminalMessages();
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const searchWord = word.value.trim();
    if (searchWord) {
        addTerminalLine(`fetch ${searchWord}`, true);
        getData(searchWord);
    }
})

const getData = async (word) => {
    try {
        resultContainer.style.display = "block";
        result.innerHTML = "Searching...";
        addTerminalLine(`Searching definition for "${word}"...`);
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
        
        // Audio section with improved UI
        if (wordData.phonetics.length === 0 || !wordData.phonetics.find(p => p.audio)) {
            result.innerHTML += `<div class="audio-section">
                <p><strong>Audio:</strong> Not Found</p>
            </div>`;
        } else {
            result.innerHTML += `<div class="audio-section">
                <p><strong>Audio:</strong></p>
            </div>`;
            
            const audioSection = result.querySelector('.audio-section');
            const audioList = document.createElement('div');
            audioList.className = 'audio-list';
            
            let audioCount = 0;
            for (let i = 0; i < wordData.phonetics.length; i++) {
                const phonetic = wordData.phonetics[i];
                if (phonetic.audio && phonetic.audio !== "") {
                    audioCount++;
                    const audioItem = document.createElement('div');
                    audioItem.className = 'audio-item';
                    
                    const audioLabel = document.createElement('span');
                    audioLabel.className = 'audio-label';
                    audioLabel.textContent = `Pronunciation ${audioCount}:`;
                    
                    const audioPlayer = document.createElement('audio');
                    audioPlayer.controls = true;
                    audioPlayer.className = 'terminal-audio';
                    
                    const audioSource = document.createElement('source');
                    audioSource.src = phonetic.audio;
                    audioSource.type = 'audio/mpeg';
                    
                    audioPlayer.appendChild(audioSource);
                    audioPlayer.innerHTML += 'Your browser does not support the audio tag.';
                    
                    audioItem.appendChild(audioLabel);
                    audioItem.appendChild(audioPlayer);
                    audioList.appendChild(audioItem);
                }
            }
            
            audioSection.appendChild(audioList);
        }
        
            result.innerHTML += `<div><a href="${wordData.sourceUrls[0]}" target="_blank">Read More</a></div>`;
            addTerminalLine(`Definition found for "${word}"`);
        } else {
            result.innerHTML = "<p>Sorry, the word could not be found</p>";
            addTerminalLine(`Word "${word}" not found in dictionary`);
        }
    }
    catch(e){
        result.innerHTML = "<p>Sorry, the word could not be found</p>";
        addTerminalLine(`Error searching for "${word}"`);
    }
}
