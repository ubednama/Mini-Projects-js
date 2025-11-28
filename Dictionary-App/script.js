// Dictionary App with Terminal Integration
class DictionaryApp {
    constructor() {
        this.terminal = null;
        this.form = document.getElementById('searchForm');
        this.wordInput = document.getElementById('word');
        this.resultContainer = document.querySelector('.result-container');
        this.result = document.querySelector('.result');
        this.loading = document.querySelector('.loading');

        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeTerminal();
    }

    initializeTerminal() {
        if (window.TerminalUtils && window.TerminalUtils.TerminalUI) {
            this.terminal = new window.TerminalUtils.TerminalUI('dictionary-app');
            this.terminal.log('Dictionary App v2.1 initialized...', 'system');
            this.terminal.log('Enter a word to search for its definition.', 'info');
        }
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchWord = this.wordInput.value.trim();
            if (searchWord) {
                this.getData(searchWord);
            }
        });
    }

    async getData(word) {
        try {
            if (this.terminal) this.terminal.log(`Fetching definition for "${word}"...`, 'info');

            this.showLoading(true);
            this.resultContainer.classList.add('hide');

            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const data = await res.json();

            this.showLoading(false);

            if (res.ok && data.length > 0) {
                this.displayResult(data[0]);
            } else {
                this.showError(`Word "${word}" not found`);
            }
        } catch (e) {
            this.showLoading(false);
            this.showError('An error occurred while fetching data');
        }
    }

    displayResult(wordData) {
        this.resultContainer.classList.remove('hide');
        const definitions = wordData.meanings[0].definitions[0];

        let html = `
            <div class="word-header">
                <h2>${wordData.word}</h2>
                <span class="part-of-speech">${wordData.meanings[0].partOfSpeech}</span>
            </div>
            <div class="definition-section">
                <p><strong>Meaning:</strong> ${definitions.definition || "Not Found"}</p>
                <p><strong>Example:</strong> ${definitions.example || "Not Found"}</p>
            </div>
        `;

        // Antonyms
        if (definitions.antonyms && definitions.antonyms.length > 0) {
            html += `<div class="antonyms-section"><p><strong>Antonyms:</strong> ${definitions.antonyms.join(', ')}</p></div>`;
        }

        // Audio
        const phonetics = wordData.phonetics.filter(p => p.audio);
        if (phonetics.length > 0) {
            html += `<div class="audio-section">`;
            phonetics.forEach((phonetic, index) => {
                html += `
                    <div class="audio-item">
                        <span>Pronunciation ${index + 1}:</span>
                        <audio controls src="${phonetic.audio}"></audio>
                    </div>
                `;
            });
            html += `</div>`;
        }

        html += `<div class="source-link"><a href="${wordData.sourceUrls[0]}" target="_blank">Read More</a></div>`;

        this.result.innerHTML = html;

        if (this.terminal) {
            this.terminal.log(`Definition found: ${wordData.word} - ${wordData.meanings[0].partOfSpeech}`, 'success');
        }

        this.wordInput.value = '';
    }

    showError(message) {
        this.resultContainer.classList.remove('hide');
        this.result.innerHTML = `<p class="error-msg">${message}</p>`;
        if (this.terminal) this.terminal.log(`Error: ${message}`, 'error');
    }

    showLoading(isLoading) {
        if (isLoading) {
            this.loading.classList.remove('hide');
        } else {
            this.loading.classList.add('hide');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DictionaryApp();
});
