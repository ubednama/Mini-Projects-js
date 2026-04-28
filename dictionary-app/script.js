// Dictionary App

// Tiny element builder — keeps DOM construction safe (no innerHTML with API data).
function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
        for (const [key, value] of Object.entries(attrs)) {
            if (key === 'class') node.className = value;
            else node.setAttribute(key, value);
        }
    }
    if (children) {
        for (const child of children) {
            node.append(child instanceof Node ? child : document.createTextNode(child));
        }
    }
    return node;
}

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
        this.result.replaceChildren();

        const definitions = wordData.meanings[0].definitions[0];

        const header = el('div', { class: 'word-header' }, [
            el('h2', null, [wordData.word]),
            el('span', { class: 'part-of-speech' }, [wordData.meanings[0].partOfSpeech]),
        ]);

        const defSection = el('div', { class: 'definition-section' }, [
            el('p', null, [el('strong', null, ['Meaning: ']), definitions.definition || 'Not Found']),
            el('p', null, [el('strong', null, ['Example: ']), definitions.example || 'Not Found']),
        ]);

        this.result.append(header, defSection);

        if (definitions.antonyms && definitions.antonyms.length > 0) {
            this.result.append(el('div', { class: 'antonyms-section' }, [
                el('p', null, [
                    el('strong', null, ['Antonyms: ']),
                    definitions.antonyms.join(', '),
                ]),
            ]));
        }

        const phonetics = wordData.phonetics.filter(p => p.audio);
        if (phonetics.length > 0) {
            const audioSection = el('div', { class: 'audio-section' });
            phonetics.forEach((phonetic, index) => {
                const audio = document.createElement('audio');
                audio.controls = true;
                audio.src = phonetic.audio;
                audioSection.append(el('div', { class: 'audio-item' }, [
                    el('span', null, [`Pronunciation ${index + 1}:`]),
                    audio,
                ]));
            });
            this.result.append(audioSection);
        }

        if (wordData.sourceUrls && wordData.sourceUrls[0]) {
            const link = document.createElement('a');
            link.href = wordData.sourceUrls[0];
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = 'Read More';
            this.result.append(el('div', { class: 'source-link' }, [link]));
        }

        this.wordInput.value = '';
    }

    showError(message) {
        this.resultContainer.classList.remove('hide');
        this.result.replaceChildren(el('p', { class: 'error-msg' }, [message]));
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
