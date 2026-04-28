// Random Quotes — demonstrates third-party API integration with loading and
// error states. Uses DummyJSON: free, key-less, CORS-enabled.

const QUOTES_URL = 'https://dummyjson.com/quotes/random';

class QuotesApp {
    constructor() {
        this.quoteText = document.querySelector("#quote");
        this.quoteAuthor = document.querySelector("#author");
        this.newQuoteBtn = document.querySelector("#new-quote-btn");
        this.toastContainer = document.querySelector("#toast-container");

        this.init();
    }

    init() {
        this.bindEvents();
        this.getQuote();
    }

    bindEvents() {
        this.newQuoteBtn.addEventListener('click', () => this.getQuote());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.getQuote();
            }
        });
    }

    async getQuote() {
        this.quoteText.innerText = "Loading...";
        this.quoteText.parentElement.classList.add('loading');
        this.quoteAuthor.innerText = "";
        this.newQuoteBtn.disabled = true;

        try {
            const response = await fetch(QUOTES_URL);
            if (!response.ok) throw new Error("API response not ok");

            const data = await response.json();
            this.quoteText.innerText = `"${data.quote}"`;
            this.quoteAuthor.innerText = `— ${data.author}`;
        } catch (error) {
            console.error("Error fetching quote:", error);
            this.quoteText.innerText = "Click button to retry.";
            this.quoteAuthor.innerText = "";
            if (window.TerminalUtils) {
                window.TerminalUtils.showToast("Failed to fetch quote. Please try again.", "error");
            }
        } finally {
            this.quoteText.parentElement.classList.remove('loading');
            this.newQuoteBtn.disabled = false;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new QuotesApp();
});
