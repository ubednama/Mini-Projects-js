// Breaking Bad Quotes API
class QuotesApp {
    constructor() {
        this.terminal = null;
        this.URL = "https://api.breakingbadquotes.xyz/v1/quotes";
        this.quoteText = document.querySelector("#quote");
        this.quoteAuthor = document.querySelector("#author");
        this.newQuoteBtn = document.querySelector("#new-quote-btn");

        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeTerminal();
        this.getQuote();
    }

    initializeTerminal() {
        if (window.TerminalUtils && window.TerminalUtils.TerminalUI) {
            this.terminal = new window.TerminalUtils.TerminalUI('bb-quotes');
            this.terminal.log('Breaking Bad Quotes API v1.0 initialized...', 'system');
        }
    }

    bindEvents() {
        this.newQuoteBtn.addEventListener('click', () => {
            this.getQuote();
        });
    }

    async getQuote() {
        if (this.terminal) this.terminal.log('Fetching new quote...', 'info');
        this.quoteText.innerText = "Loading...";
        this.quoteAuthor.innerText = "";

        try {
            let response = await fetch(this.URL);
            let data = await response.json();

            this.quoteText.innerText = `"${data[0].quote}"`;
            this.quoteAuthor.innerText = `- ${data[0].author}`;

            if (this.terminal) {
                this.terminal.log(`Quote received from ${data[0].author}`, 'success');
            }
        } catch (error) {
            console.error("Error fetching quote:", error);
            this.quoteText.innerText = "Failed to load quote.";
            if (this.terminal) this.terminal.log('Error fetching quote', 'error');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new QuotesApp();
});