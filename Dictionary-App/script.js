// Dictionary App
class DictionaryApp {
    constructor() {
        this.form = document.getElementById('searchForm');
        this.wordInput = document.getElementById('word');
        this.resultContainer = document.querySelector('.result-container');
        this.result = document.querySelector('.result');
        this.loading = document.querySelector('.loading');
        this.toastContainer = document.querySelector("#toast-container");

        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchWord = this.wordInput.value.trim();
            if (searchWord) {
                this.getData(searchWord);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchWord = this.wordInput.value.trim();
                if (searchWord) {
                    this.getData(searchWord);
                }
            }
        });
    }

    async getData(word) {
        try {
            this.showLoading(true);
            this.resultContainer.classList.add('hide');

            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

            if (!res.ok) {
                throw new Error("Word not found");
            }

            const data = await res.json();
            this.showLoading(false);

            if (data.length > 0) {
                this.displayResult(data[0]);
            } else {
                this.showError(`Word "${word}" not found`);
            }
        } catch (e) {
            this.showLoading(false);
            console.error(e);
            this.showError('An error occurred. Please try again.');
            this.showToast(`Error: ${e.message}`, 'error');
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
        this.wordInput.value = '';
    }

    showError(message) {
        this.resultContainer.classList.remove('hide');
        this.result.innerHTML = `<p class="error-msg">${message}</p>`;
    }

    showLoading(isLoading) {
        if (isLoading) {
            this.loading.classList.remove('hide');
        } else {
            this.loading.classList.add('hide');
        }
    }

    showToast(message, type = 'error') {
        if (window.TerminalUtils) {
            window.TerminalUtils.showToast(message, type);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DictionaryApp();
});
