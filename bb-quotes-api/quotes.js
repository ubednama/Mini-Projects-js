// Breaking Bad Quotes API
class QuotesApp {
    constructor() {
        this.URL = "https://api.breakingbadquotes.xyz/v1/quotes";
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
        this.newQuoteBtn.addEventListener('click', () => {
            this.getQuote();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.getQuote();
            }
        });
    }

    async getQuote() {
        this.quoteText.innerText = "Loading";
        this.quoteText.parentElement.classList.add('loading');
        this.quoteAuthor.innerText = "";
        this.newQuoteBtn.disabled = true;

        try {
            let response = await fetch(this.URL);
            if (!response.ok) throw new Error("API Response not ok");

            let data = await response.json();

            this.quoteText.innerText = `"${data[0].quote}"`;
            this.quoteAuthor.innerText = `${data[0].author}`;
        } catch (error) {
            console.error("Error fetching quote:", error);
            this.quoteText.innerText = "Click button to retry.";
            this.showToast("Failed to fetch quote. Please try again.", "error");
        } finally {
            this.quoteText.parentElement.classList.remove('loading');
            this.newQuoteBtn.disabled = false;
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerText = message;

        if (this.toastContainer) {
            this.toastContainer.appendChild(toast);

            // Auto remove after 3 seconds
            setTimeout(() => {
                toast.classList.add('fade-out');
                toast.addEventListener('animationend', () => {
                    toast.remove();
                });
            }, 3000);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new QuotesApp();
});